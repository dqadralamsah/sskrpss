import { Session } from 'inspector/promises';
import { HomeNavbar } from './navHome';
import { SideNavbar } from './navMenu';

const Navbar = ({ session }: { session: any }) => {
  return (
    <>
      <nav>
        <SideNavbar session={session} />
      </nav>
    </>
  );
};

export default Navbar;
