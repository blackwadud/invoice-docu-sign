'use client';
import { googleLogin } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function GoogleSignInButton() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-red-500 text-white w-full max-w-md py-2 mt-4"
    >
      Sign in with Google
    </button>
  );
}
