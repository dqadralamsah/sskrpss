import { SideNavbar } from './navMenu';

const Navbar = ({
  session,
  isOpen,
  setIsOpen,
}: {
  session: any;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  return (
    <>
      <nav>
        <SideNavbar session={session} isOpen={isOpen} setIsOpen={setIsOpen} />
      </nav>
    </>
  );
};

export default Navbar;
