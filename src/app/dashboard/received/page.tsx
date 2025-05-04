'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import DocumentCard from '@/components/DocumentCard';
import { useRouter } from 'next/navigation';

export default function ReceivedDocsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/');
      return;
    }

    const q = query(
      collection(db, 'documents'),
      where('signerEmail', '==', user.email),
      orderBy('createdAt', 'desc') // newest first
    );

    const unsub = onSnapshot(q, (snap) => {
      setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [loading, user, router]);

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Invoices You Received</h1>

      {docs.length === 0 ? (
        <p>No incoming invoices.</p>
      ) : (
        docs.map((d) => (
          <DocumentCard
            key={d.id}
            id={d.id}
            description={d.description}
            signerEmail={d.uploadedByEmail}
            status={d.status}
          />
        ))
      )}
    </div>
  );
}
