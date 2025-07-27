import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All hackathons",
      slug: "/all-events",
      active: true,
    },
  ]; //array of items which are to be displayed in the navigation bar;
  /*We will hide the items which are not to be shown, depending upon the status */

  return (
    <header className="p-3 fixed bg-defaults z-10 w-full font-poppins">
      <Container>
        <nav className="flex justify-between items-center">
          <div className="mr-4 flex gap-[10px] items-center">
            <Link to="/">
              <Logo className="w-[50px]" />
            </Link>
            <h1 className=" text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
              <span className="bg-gradient-to-r from-[#3e2b1f] via-[#a67f6b] to-gradients bg-clip-text text-transparent">
                AvidReader
              </span>
            </h1>
          </div>
          <ul className="flex text-xl font-poppins gap-[45px] ">
            {navItems.map((item) =>
              item.active ? (
                <li
                  key={item.name}
                  className="hover:text hover:scale-105 transition-all ease-in-out duration-300"
                >
                  <button
                    onClick={() => navigate(item.slug)}
                    className=" items-center text-buttonsT"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {/*the below line means condition will execute if authStatus is true */}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;