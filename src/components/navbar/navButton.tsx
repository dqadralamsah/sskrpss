import { ChevronLeft } from 'lucide-react';

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

export const NavButton = ({ isOpen, toggle }: Props) => {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle Menu"
      className={`navButton p-2 rounded-md bg-purple-200 cursor-pointer translate-x-4 transition-transform duration-700 hover:bg-nds-purple1 ${
        isOpen ? 'absolute top-[21.5] right-4' : 'absolute top-[21.5] right-4.25'
      }`}
    >
      <ChevronLeft
        size={24}
        strokeWidth={2}
        className={`transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
      />
    </button>
  );
};
