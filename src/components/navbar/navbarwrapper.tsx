'use client';

import { useState } from 'react';
import { SideNavbar } from './navMenu';

export default function NavbarWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNavbar session={session} isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-1 mx-2 overflow-y-auto">{children}</main>
    </div>
  );
}
