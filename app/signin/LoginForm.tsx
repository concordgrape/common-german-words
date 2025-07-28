'use client';

import React from 'react';

import { FaApple } from "react-icons/fa";
import GoogleSignInButton from './SignInWithGoogle';

const LoginForm: React.FC = () => {
  return (
      <div className="w-full m-auto max-h-[600px] max-w-md bg-white dark:bg-[#1E1E1E] p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Sign in</h2>

        <form className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox" />
              Remember me
            </label>
            <a href="#" className="text-indigo-600 dark:text-indigo-500 hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150"
          >
            Sign in
          </button>
        </form>

        <div className="my-6 flex items-center justify-center text-gray-400 dark:text-gray-300 text-sm">
          <div className="w-full border-t border-gray-200" />
          <span className="px-2 text-center">Or continue with</span>
          <div className="w-full border-t border-gray-200" />
        </div>

        <div className="flex flex-col items-center justify-center">
          <GoogleSignInButton />
        <button className="w-[200px] mt-2 flex items-center justify-center gap-4 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
            <FaApple />
            Sign in with Apple
        </button>
        </div>
      </div>
  );
};

export default LoginForm;
