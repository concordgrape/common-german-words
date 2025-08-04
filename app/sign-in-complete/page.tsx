'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseClient';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function FinishSignIn() {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        const email = window.localStorage.getItem('emailForSignIn');
        if (!email || !isSignInWithEmailLink(auth, window.location.href)) {
          throw new Error('Invalid sign-in link.');
        }

        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        setStatus('success');
        router.push('/browse'); // redirect after login
      } catch (error) {
        console.error('Error signing in:', error);
        setStatus('error');
      }
    };

    completeSignIn();
  }, [router]);

  if (status === 'checking') return <p>Completing sign-in...</p>;
  if (status === 'error') return <p>Sign-in failed. Please try again.</p>;

  return <p>Sign-in successful! Redirecting...</p>;
}
