'use client';

import React, { useState, useEffect } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import GoogleSignInButton from './SignInWithGoogle';
import { useUser } from '../context/UserContext';
//import SignInWithApple from './SignInWithApple';
import { useRouter } from 'next/navigation';

const actionCodeSettings = {
  url: 'https://common-german-words.vercel.app/sign-in-complete',
  handleCodeInApp: true,
};

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { user, loading } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setStatus('sent');
    } catch (error) {
      console.error('Error sending sign-in link:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/profile")
    }
  }, [user]);

  return (
    <div className="w-full m-auto max-h-[600px] max-w-md bg-white dark:bg-[#1E1E1E] p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">Sign in</h2>
      <h4 className="text-sm text-gray-900 dark:text-white mb-6 text-left">
        <i>
          We use a <b>password free</b> sign in method. You will receive a verification email.<br />
          First time on Common German Words? An account will automatically be created.
        </i>
      </h4>

      <form className={`${loading ? 'skeleton opacity/50' : ''} space-y-5`} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150"
        >
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Email Sent!' : 'Sign in'}
        </button>
      </form>

      <div className="my-6 flex items-center justify-center text-gray-400 dark:text-gray-300 text-sm">
        <div className="w-full border-t border-gray-200" />
        <span className="px-2 text-center">Or continue with</span>
        <div className="w-full border-t border-gray-200" />
      </div>

      <div className="flex flex-col items-center justify-center">
        <GoogleSignInButton />
        {/*<SignInWithApple />*/} {/* We must wait until we have an app to enable/configure through it */}
      </div>
    </div>
  );
};

export default LoginForm;
