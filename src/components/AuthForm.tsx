'use client';
import { useState, FormEvent } from 'react';
import { register, login } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // shared
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // registration‑only
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [wallet, setWallet] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          firstName,
          lastName,
          wallet,
        });
      }
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {!isLogin && (
        <>
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
        </>
      )}

      <input
        type="email"
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="border p-2 w-full"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="bg-blue-600 text-white w-full py-2">
        {isLogin ? 'Login' : 'Register'}
      </button>

      <p
        className="text-sm text-blue-600 cursor-pointer text-center"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? 'Need an account? Register'
          : 'Already have an account? Login'}
      </p>
    </form>
  );
}
