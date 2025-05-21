import { Link } from "@heroui/link";
import { useLocation } from "react-router-dom";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import MerchantSelect from "./merchant-select";

import { ThemeSwitch } from "@/components/theme-switch";
import { ReconciliationLogo } from "@/components/icons";

export const Navbar = () => {
  const location = useLocation();
  const isProcessFlow = location.pathname === "/process-flow";

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <ReconciliationLogo />
            <p className="font-bold text-inherit">Hyperswitch Recon</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        {isProcessFlow && (
          <NavbarItem>
            <MerchantSelect className="w-48" />
          </NavbarItem>
        )}
      </NavbarContent>
    </HeroUINavbar>
  );
};
