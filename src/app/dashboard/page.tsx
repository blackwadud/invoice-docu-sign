'use client';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardHome() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const go = async () => {
      if (loading) return;

      // not signed in ➜ landing page
      if (!user) {
        router.replace('/');
        return;
      }

      // 1️⃣ e‑mail not verified ➜ verification page
      if (!user.emailVerified) {
        router.replace('/verify-email');
        return;
      }

      // 2️⃣ profile completeness
      const snap = await getDoc(doc(db, 'users', user.uid));
      const profile = snap.data() || {};
      const hasAll =
        profile.firstName && profile.lastName && profile.wallet?.length > 0;

      if (!hasAll) {
        router.replace('/complete-profile');
      } else {
        router.replace('/dashboard/create');
      }
    };

    go();
  }, [loading, user, router]);

  return <p className="p-4">Loading…</p>;
}
