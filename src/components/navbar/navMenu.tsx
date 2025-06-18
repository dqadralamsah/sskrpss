'use client';

import { navMenuConfig } from '@/config/navConfig';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NavButton } from './navButton';

const roleToKey: Record<string, keyof typeof navMenuConfig> = {
  Admin: 'admin',
  Purchasing: 'purchasing',
  Warehouse: 'warehouse',
};

export const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // const { data: session } = useSession();
  // const pathname = usePathname();

  // const role = session?.user?.role;
  // const navKey = roleToKey[role || ''] ?? 'admin';
  // const menu = navConfig[navKey];

  return (
    <>
      <nav
        className={`flex flex-col h-dvh transition-all duration-300 ease-in-out bg-amber-300 ${
          isOpen ? 'w-64 ' : 'w-16'
        }`}
      >
        <div className="navMenuHead p-4">
          {isOpen ? (
            <div className=" flex item-center justify-between overflow-hidden">
              <h1 className="text-2xl font-bold duration-300 ease-in-out">NADISO</h1>
              <NavButton isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
            </div>
          ) : (
            <div className=" flex item-center justify-center">
              <NavButton isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
