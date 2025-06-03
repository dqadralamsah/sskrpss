'use client';

import { useFormStatus } from 'react-dom';

export const SignInButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className=" w-full p-2.5 text-white font-medium bg-nds-purple1 rounded-lg  cursor-pointer hover:bg-nds-purple2"
    >
      {pending ? 'Authenticating...' : 'Sign In'}
    </button>
  );
};
