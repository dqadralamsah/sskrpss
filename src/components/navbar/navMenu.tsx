'use client';

import { navMenuConfig } from '@/config/navConfig';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NavButton } from './navButton';
import Image from 'next/image';
import navLogoImg from '@/../../public/logo1.png';

const roleToKey: Record<string, keyof typeof navMenuConfig> = {
  Admin: 'admin',
  Purchasing: 'purchasing',
  Warehouse: 'warehouse',
};

export const SideNavbar = ({ session }: { session: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const role = session?.user?.role;
  const navKey = role ? roleToKey[role] : undefined;
  const menu = navKey ? navMenuConfig[navKey] : [];

  return (
    <nav
      className={`h-dvh flex flex-col p-4 gap-4 shadow-2xl overflow-hidden ${
        isOpen ? 'w-72' : 'w-[72px]'
      } transition-[width] duration-700`}
    >
      <div
        className={`navMenuHeader relative w-full flex items-center justify-between py-2 border-b-2 border-gray-300 ${
          isOpen ? '' : ''
        }`}
      >
        <Image
          src={navLogoImg}
          alt="Logo"
          className={`w-[150px] h-[33px] flex items-center m-1 object-cover transition-opacity duration-500 ${
            isOpen ? '' : 'opacity-0'
          }`}
        />
        <NavButton isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
      </div>
      <div className="navMenu flex flex-col gap-4">
        {menu.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={`flex items-center p-2 gap-4 rounded-md transition-colors duration-300  whitespace-nowrap ${
              pathname === href ? ' text-white bg-nds-purple1 hover:bg-none' : 'hover:bg-purple-200'
            }`}
          >
            <Icon strokeWidth={1.5} className="w-[24px] h-[24px] flex-none" />
            <span
              className={`flex items-center  text-[18px] font-medium transition-opacity duration-500 ${
                isOpen ? '' : 'opacity-0'
              }`}
            >
              {name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
