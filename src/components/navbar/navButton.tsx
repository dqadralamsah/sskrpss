import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

export const NavButton = ({ isOpen, toggle }: Props) => {
  return (
    <>
      <button onClick={toggle} aria-label="Toggle Menu" className="  p-2 cursor-pointer">
        {isOpen ? (
          <ChevronLeft size={24} strokeWidth={3} />
        ) : (
          <ChevronRight size={24} strokeWidth={3} />
        )}
      </button>
    </>
  );
};
