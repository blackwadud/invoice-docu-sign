'use client';

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AuditPage() {
  const { user, loading } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (loading || !user) return;
    const q = query(
      collection(db, 'audit'),
      orderBy('timestamp', 'desc'),
    );
    const unsub = onSnapshot(q, (snap) =>
      setLogs(snap.docs.map((d) => d.data())),
    );
    return () => unsub();
  }, [loading, user]);

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Audit Log</h1>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Doc ID</th>
            <th className="p-2 border">Signer</th>
            <th className="p-2 border">Block</th>
            <th className="p-2 border">Etherscan</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.txHash}>
              <td className="p-2 border">{l.docId}</td>
              <td className="p-2 border">{l.signer}</td>
              <td className="p-2 border">{l.block}</td>
              <td className="p-2 border">
                <Link
                  href={`https://sepolia.etherscan.io/tx/${l.txHash}`}
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
