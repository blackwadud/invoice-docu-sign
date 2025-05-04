'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function CompleteProfile() {
  const { user } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [wallet, setWallet] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await setDoc(
      doc(db, 'users', user.uid),
      { firstName, lastName, wallet },
      { merge: true },
    );

    router.replace('/dashboard/create');
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Complete Profile</h1>
      <form onSubmit={save} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Ethereum wallet address"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2">
          Save
        </button>
      </form>
    </div>
  );
}
