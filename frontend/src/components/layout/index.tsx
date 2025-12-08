import { Toaster } from "@/components/ui/sonner";
import { Link, Outlet } from "react-router-dom";
import Logo from "../../assets/svgs/logo.svg";
import ThemeButtonMode from "../shared/theme-toggle";

export default function BaseLayout() {
  return (
    <>
      {/* Navbar */}
      <Link to="/">
        <header className="p-5 flex items-center hover:cursor-pointer">
          <img src={Logo} alt="Logo" width={40} height={40} />
          <h1 className="md:text-2xl font-bold ml-2 text-lg">
            Atica Canteen Management System
          </h1>
        </header>
      </Link>
      {/* Theme - showing at different positions based on screen size */}
      <div className="relative">
        {/* Theme shows at top right on Desktop*/}
        <div className="absolute space-x-3 md:flex hidden items-center justify-center md:-top-11 md:right-4">
          <span className="dark:text-muted-foreground ">Theme</span>
          <ThemeButtonMode />
        </div>
        {/* Theme shows at bottom right on Mobile*/}
        <div className="absolute space-x-3 md:hidden flex items-center justify-center -bottom-[600px] left-4">
          <span className="dark:text-muted-foreground">Theme</span>
          <ThemeButtonMode />
        </div>
      </div>
      <main>
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
