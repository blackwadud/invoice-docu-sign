'use client';
import { useAuth } from '@/hooks/useAuth';
import { sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

export default function VerifyEmailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resent, setResent] = useState(false);

  // auto‑redirect once verified
  useEffect(() => {
    if (!loading && user?.emailVerified) {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  if (!user) return null;

  const resend = async () => {
    await sendEmailVerification(user);
    setResent(true);
  };

  const refresh = async () => {
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded text-center">
      <h1 className="text-2xl font-bold mb-4">Verify your e‑mail</h1>
      <p>
        We just sent a verification link to <b>{user.email}</b>.
        <br />
        Check your inbox and click “Verify”.
      </p>

      <button onClick={resend} className="bg-blue-600 text-white px-4 py-2 mt-4">
        Resend e‑mail
      </button>

      <button
        onClick={refresh}
        className="bg-green-600 text-white px-4 py-2 mt-4 ml-2"
      >
        I’ve verified ✓
      </button>

      {resent && <p className="text-green-600 mt-2">E‑mail sent!</p>}
    </div>
  );
}
