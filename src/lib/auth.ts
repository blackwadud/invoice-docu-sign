import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  wallet: string;
};

export const register = async ({
  email,
  password,
  firstName,
  lastName,
  wallet,
}: RegisterPayload) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, 'users', cred.user.uid), {
    email,
    firstName,
    lastName,
    wallet,
    createdAt: new Date().toISOString(),
  });

  // 🔑 send verification email
  await sendEmailVerification(cred.user);
};

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const googleLogin = async () => {
  const res = await signInWithPopup(auth, new GoogleAuthProvider());
  const { uid, email, displayName, emailVerified } = res.user;

  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email,
      firstName: displayName?.split(' ')[0] ?? '',
      lastName: displayName?.split(' ').slice(1).join(' ') ?? '',
      wallet: '',
      createdAt: new Date().toISOString(),
    });
  }

  // 🔑 if Google didn’t auto‑verify, send verification e‑mail
  if (!emailVerified) {
    await sendEmailVerification(res.user);
  }
};

export const logout = () => signOut(auth);
