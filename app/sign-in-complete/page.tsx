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

  return (
    <div className="sm:top-15 md:top-15 pt-15 text-left justify-left">
      <div className="min-h-screen w-full sm:p-4 md:p-4 pb-0 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0 dark:[#1B263B]">
        <h1 className='text-black dark:text-white font-semibold text-lg'>Sign in was successful, redirecting</h1>
        <p className='text-black dark:text-white text-sm'>Click here if you haven&apos;t be redirected in 3 seconds...</p>
      </div>
    </div>
  )
}
