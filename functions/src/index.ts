/* eslint-disable require-jsdoc */
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';
import nodemailer from 'nodemailer';
import corsLib from 'cors';

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

const cors = corsLib({ origin: true });

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

    const { id, signerEmail, signerName, uploadedByEmail, description } =
      data as DocData;

    const link = `https://income-sign.vercel.app/sign/${id}`;
    const html = `
      <p>Hello ${signerName || ''},</p>
      <p><b>${uploadedByEmail}</b> has sent you an invoice to sign.</p>
      <p>Description: ${description}</p>
      <p><a href='${link}'>Review and sign</a></p>
    `;

    try {
      await transporter.sendMail({
        from: `'Abdulwadud Invoice DocuSign ' <${GMAIL_USER}>`,
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

export const emailSigned = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { docId } = req.body;
      if (!docId) {
        res.status(400).send('Missing docId');
        return;
      }

      const snap = await admin
        .firestore()
        .collection('documents')
        .doc(docId)
        .get();

      if (!snap.exists) {
        res.status(404).send('Document not found');
        return;
      }

      const data = snap.data() as any;
      const { uploadedByEmail, signerEmail, fileUrl } = data;

      // Fetch the PDF from storage URL
      const pdfResp = await fetch(fileUrl);
      if (!pdfResp.ok) {
        res.status(502).send('Failed to fetch PDF');
        return;
      }

      const buffer = await pdfResp.arrayBuffer();

      // Send completed invoice email
      await transporter.sendMail({
        from: `'DocuSign Clone' <${GMAIL_USER}>`,
        to: [uploadedByEmail, signerEmail],
        subject: `Completed Invoice · ${docId}`,
        text: `Your invoice ${docId} has been signed.`,
        attachments: [
          {
            filename: `${docId}-signed.pdf`,
            content: Buffer.from(buffer),
          },
        ],
      });

      res.status(200).send('Email sent');
    } catch (err) {
      console.error('emailSigned error', err);
      res.status(500).send('Internal error');
    }
  });
});
