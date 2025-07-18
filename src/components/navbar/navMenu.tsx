'use client';

import Link from 'next/link';
import { navMenuConfig } from '@/config/navConfig';
import { usePathname } from 'next/navigation';
import { NavButton } from './navButton';
import Image from 'next/image';
import navLogoImg from '@/../../public/logo1.png';

const roleToKey: Record<string, keyof typeof navMenuConfig> = {
  Admin: 'admin',
  Purchasing: 'purchasing',
  Warehouse: 'warehouse',
};

export const SideNavbar = ({
  session,
  isOpen,
  setIsOpen,
}: {
  session: any;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const pathname = usePathname();

  const role = session?.user?.role;
  const navKey = role ? roleToKey[role] : undefined;
  const menu = navKey ? navMenuConfig[navKey] : [];

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col p-4 shadow-xl overflow-hidden z-45 bg-white transition-[width] duration-500 ${
        isOpen ? 'w-72' : 'w-[74px]'
      }`}
    >
      <div className="relative w-full flex items-center justify-between py-2 my-2 border-b border-gray-300">
        <Image
          src={navLogoImg}
          alt="Logo"
          className={`w-[150px] h-[33px] object-contain transition-opacity duration-500  ${
            isOpen ? 'opacity-100' : 'opacity-0 w-0'
          }`}
        />
        <NavButton isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
      </div>

      <nav className="flex flex-col gap-4">
        {menu.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={`flex items-center p-2 gap-4 rounded-md transition-colors duration-300 whitespace-nowrap ${
              pathname === href ? 'bg-nds-purple1 text-white' : 'hover:bg-purple-200'
            }`}
          >
            <Icon strokeWidth={1.5} size={24} className="flex-none" />
            <span
              className={`text-sm font-medium transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
