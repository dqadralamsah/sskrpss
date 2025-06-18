import { HomeNavbar } from './navHome';
import { SideNavbar } from './navMenu';

const Navbar = () => {
  return (
    <>
      <nav>
        <SideNavbar />
        <HomeNavbar />
      </nav>
    </>
  );
};

export default Navbar;
