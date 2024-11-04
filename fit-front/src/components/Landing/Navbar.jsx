"use client";
import Link from "next/link";
import ThemeChanger from "../DarkSwitch";
import Logo from "../../components/logo";
import { Container } from "../Container";

export const Navbar = () => {
  return (
    <div className="w-full">
      <nav className="container px-8 relative flex flex-wrap items-center justify-between mx-auto lg:justify-between xl:px-1">
        {/* Logo  */}
        <Link href="/">
          <span className="flex items-center space-x-2 text-2xl font-medium text-blue-600 dark:text-gray-100">
            <span>
              <Logo
                color="#1c64f2"
                width="60"
                alt="Logo GoalFit"
                height="60"
                className="w-8"
              />
            </span>
            <h1 className="text-2xl font-bold ms-2 font-mono">GoalFit</h1>
          </span>
        </Link>

        <div className="gap-3 nav__item mr-2 lg:flex ml-auto lg:ml-0 lg:order-2">
          <ThemeChanger />
          <div className="hidden mr-3 lg:flex nav__item">
            <Link
              href="/register"  
              className="px-6 py-2 text-white bg-blue-600 rounded-md md:ml-5"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
