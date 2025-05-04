// src/app/dashboard/create/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { generateInvoicePDF } from '@/lib/utils/pdf';
import { useRouter } from 'next/navigation';

export default function CreateInvoicePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !user) return;

    // Prevent self‑assignment
    if (user.email?.toLowerCase() === signerEmail.trim().toLowerCase()) {
      alert("You can't assign an invoice to yourself.");
      return;
    }

    try {
      setCreating(true);
      const docId = uuidv4();

      // 1️⃣ Generate PDF blob
      const pdfBlob = await generateInvoicePDF({
        from: user.email!,
        to: signerEmail,
        description,
      });

      // 2️⃣ Upload PDF to Firebase Storage
      const fileRef = ref(storage, `documents/${docId}.pdf`);
      await uploadBytes(fileRef, pdfBlob);
      const fileUrl = await getDownloadURL(fileRef);

      // 3️⃣ Write Firestore metadata
      await setDoc(doc(db, 'documents', docId), {
        id: docId,
        uploadedBy: user.uid,
        uploadedByEmail: user.email,
        signerName,
        signerEmail,
        description,
        fileUrl,
        createdAt: new Date().toISOString(),
        status: 'pending',
      });

      alert('Invoice created—signer will receive an email shortly.');
      router.push('/dashboard/sign-requests');
    } catch (err: any) {
      console.error(err);
      alert('Failed to create invoice: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white border border-gray-300 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
        📝 Create Invoice
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Signer Name"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 bg-white"
        />

        <input
          type="email"
          placeholder="Signer Email"
          value={signerEmail}
          onChange={(e) => setSignerEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 bg-white"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 bg-white"
        />

        <button
          type="submit"
          disabled={creating}
          className={`w-full py-2 px-4 font-semibold rounded text-white ${
            creating ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          } transition`}
        >
          {creating ? 'Creating…' : 'Send Invoice for Signature'}
        </button>
      </form>
    </div>
  );
}
