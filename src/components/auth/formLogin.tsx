'use client';

import React from 'react';
import { LoginButton } from './formButton';
import { signinCredentials } from '@/lib/actions';

const FormLogin = () => {
  const [state, formAction] = React.useActionState(signinCredentials, null);

  return (
    <form action={formAction} className=" space-y-6">
      {state?.message ? (
        <div className=" p-4 rounded-lg text-sm text-red-800 bg-red-100" role="alert">
          <span className=" font-medium">{state?.message}</span>
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className=" block mb-2 text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="email"
          className=" p-2.5 w-full  rounded-lg bg-gray-50 border border-gray-300 focus:outline-nds-purple1"
        />
        <div aria-live="polite" aria-atomic="true">
          <span className=" mt-2 text-sm text-red-500 ">{state?.error?.email}</span>
        </div>
      </div>
      <div>
        <label htmlFor="password" className=" block mb-2 text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="password"
          className=" w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-nds-purple1"
        />
        <div aria-live="polite" aria-atomic="true">
          <span className=" mt-2 text-sm text-red-500 ">{state?.error?.password}</span>
        </div>
      </div>
      <LoginButton />
    </form>
  );
};

export default FormLogin;
