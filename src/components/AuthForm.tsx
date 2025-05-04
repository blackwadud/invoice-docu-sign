// src/components/AuthForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { register, login } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

interface AuthFormProps {
  defaultMode?: 'login' | 'register';
}

export default function AuthForm({ defaultMode = 'login' }: AuthFormProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [wallet, setWallet] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
        // after successful login, check verification
        const user = auth.currentUser;
        if (user && !user.emailVerified) {
          router.push('/verify-email');
          return;
        }
      } else {
        await register({ email, password, firstName, lastName, wallet });
        // after register, always go to verify page
        router.push('/verify-email');
        return;
      }

      // if we get here, user is logged in & verified
      router.push('/dashboard/create');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {!isLogin && (
        <>
          <input
            className="border p-2 w-full rounded"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="border p-2 w-full rounded"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            className="border p-2 w-full rounded"
            placeholder="Ethereum wallet address"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            required
          />
        </>
      )}

      <input
        type="email"
        className="border p-2 w-full rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="border p-2 w-full rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className={`w-full py-2 rounded font-semibold text-white ${
          submitting
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-black hover:bg-gray-800'
        } transition`}
        disabled={submitting}
      >
        {submitting
          ? isLogin
            ? 'Logging in…'
            : 'Registering…'
          : isLogin
          ? 'Login'
          : 'Register'}
      </button>

      <p
        className="text-sm text-blue-600 cursor-pointer text-center"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Register"
          : 'Already have an account? Login'}
      </p>
    </form>
  );
}
