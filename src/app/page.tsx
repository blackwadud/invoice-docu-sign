// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, googleLogin } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard/create');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setSubmitting(true);
    try {
      await googleLogin();
      router.push('/dashboard/create');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Invoice DocuSign Clone
          </h1>
          {error && (
            <p className="text-sm text-red-600 text-center mb-4">{error}</p>
          )}
          <form onSubmit={onLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2 rounded font-semibold text-white ${
                submitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
              } transition`}
            >
              {submitting ? 'Logging in…' : 'Login'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a
              href="/register"
              className="text-sm text-blue-600 hover:underline"
            >
              Need an account? Register
            </a>
          </div>
          <div className="mt-6">
            <button
              onClick={onGoogle}
              disabled={submitting}
              className={`w-full py-2 rounded font-semibold text-white ${
                submitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'
              } transition`}
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
