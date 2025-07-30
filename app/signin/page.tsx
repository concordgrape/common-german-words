"use client";

import React, { Suspense } from 'react';
import LoginForm from './LoginForm';

function SignIn() {
  return (
    <div className="w-full pt-25 mx-auto">
      <LoginForm />
    </div>
  );
};


export default function SignInPage() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  )
}
