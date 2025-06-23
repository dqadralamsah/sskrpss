'use client';

import Navbar from '@/components/navbar/navbar';
import { useState } from 'react';

export default function NavbarWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className=" flex">
        <Navbar session={session} isOpen={isOpen} setIsOpen={setIsOpen} />
        <main
          className={`transition-all duration-500 ease-in-out w-full ${
            isOpen ? 'mx-8' : 'mx-8'
          } py-4`}
        >
          {children}
        </main>
      </div>
    </>
  );
}
