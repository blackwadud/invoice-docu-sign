'use client';

import AuthForm from '@/components/AuthForm'; // adjust path if needed

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-black p-4">
      <AuthForm defaultMode="register" />
    </main>
  );
}
