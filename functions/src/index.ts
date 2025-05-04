/* eslint-disable require-jsdoc */
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';
import nodemailer from 'nodemailer';

admin.initializeApp();

// Load Gmail credentials from Functions config
const cfg = functions.config().gmail || {};
const GMAIL_USER = cfg.user as string;
const GMAIL_PASS = (cfg.app_password as string).replace(/ /g, '');

// Create a reusable Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

/**
 * Firestore trigger: when a new invoice is created,
 * send a real email to the signer via Gmail SMTP.
 */
export const sendSignRequest = functions.firestore
  .document('documents/{docId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    if (!data) return;

    interface DocData {
      id: string;
      signerEmail: string;
      signerName: string;
      uploadedByEmail: string;
      description: string;
    }

    const {
      id,
      signerEmail,
      signerName,
      uploadedByEmail,
      description,
    } = data as DocData;

    const link = `http://localhost:3000/sign/${id}`;
    const html = `
      <p>Hello ${signerName || ''},</p>
      <p><b>${uploadedByEmail}</b> has sent you an invoice to sign.</p>
      <p>Description: ${description}</p>
      <p><a href="${link}">Review and sign</a></p>
    `;

    try {
      await transporter.sendMail({
        from: `"DocuSign Clone" <${GMAIL_USER}>`,
        to: signerEmail,
        subject: `Signature request · Invoice ${id}`,
        html,
      });
      console.log(`Gmail: sent to ${signerEmail}`);
    } catch (err: any) {
      console.error('Gmail error', err);
      throw err;
    }
  });
