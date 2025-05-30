import { Link } from "@heroui/link";
import { useLocation } from "react-router-dom";
import {
  HomeIcon,
  ArrowPathIcon,
  BanknotesIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { ThemeSwitch } from "@/components/theme-switch";
import { ReconciliationLogo } from "@/components/icons";
import clsx from "clsx";

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Process Flow",
    href: "/process-flow",
    icon: ArrowPathIcon,
  },
  {
    name: "Accounts",
    href: "/accounts",
    icon: BanknotesIcon,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: CreditCardIcon,
  },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full w-64 border-r border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link
          className="flex justify-start items-center gap-1"
          color="foreground"
          href="/"
        >
          <ReconciliationLogo />
          <p className="font-bold text-inherit">Hyperswitch Recon</p>
        </Link>
      </div>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <item.icon
                  className={clsx(
                    "mr-3 h-6 w-6 flex-shrink-0",
                    isActive
                      ? "text-primary"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <ThemeSwitch />
      </div>
    </div>
  );
};
