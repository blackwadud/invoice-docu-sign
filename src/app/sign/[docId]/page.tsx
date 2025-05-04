'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import SignaturePad from '@/components/SignaturePad';

export default function SignPage() {
  /* ── hooks ─────────────────────────────────────────────── */
  const { docId } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [invoice, setInvoice] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /* ── fetch invoice ─────────────────────────────────────── */
  useEffect(() => {
    if (!docId) return;

    (async () => {
      const snap = await getDoc(doc(db, 'documents', docId as string));
      if (!snap.exists()) {
        setError('Document not found.');
        return;
      }
      setInvoice({ id: snap.id, ...snap.data() });
    })();
  }, [docId]);

  /* ── save signature ────────────────────────────────────── */
  const handleSignature = async (dataUrl: string) => {
    if (!invoice || !user) return;
    if (invoice.signerEmail !== user.email) {
      setError('You are not authorized to sign this invoice.');
      return;
    }
    try {
      setSubmitting(true);
      // upload PNG
      const imgRef = ref(storage, `signatures/${invoice.id}.png`);
      await uploadString(imgRef, dataUrl, 'data_url');
      const sigUrl = await getDownloadURL(imgRef);
      // update Firestore
      await updateDoc(doc(db, 'documents', invoice.id), {
        status: 'signed',
        signedAt: new Date(),
        signatureUrl: sigUrl,
      });
      router.push('/dashboard/signed');
    } catch (e) {
      console.error(e);
      setError('Failed to save signature. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── UI states ─────────────────────────────────────────── */
  if (loading || !invoice) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (invoice.status === 'signed')
    return (
      <p className="p-4 text-green-600">
        This document has already been signed.
      </p>
    );

  /* ── render ─────────────────────────────────────────────── */
  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Sign Invoice</h1>

      {/* PDF preview  */}
      <iframe
        src={invoice.fileUrl}
        title="Invoice PDF"
        className="w-full h-[600px] border rounded"
      />

      {/* signature pad */}
      <SignaturePad onDone={handleSignature} />

      {submitting && (
        <p className="text-sm text-blue-600">Saving signature…</p>
      )}
    </div>
  );
}
