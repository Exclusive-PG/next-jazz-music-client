import Link from "next/link";
import { usePathname } from "next/navigation";

import { type PropsNavList } from "~/constants";

export const NavItem: React.FC<PropsNavList> = ({ title, icon, link }) => {
  const currentRoute = usePathname();
  return (
    <Link
      href={link}
      className={`decoration my-3 flex list-none items-center rounded-md px-2 py-4 text-white no-underline transition duration-100 ease-in-out max-md:justify-center ${
        currentRoute === link ? "bg-mainRed" : "hover:bg-mainRed"
      }`}
    >
      {icon}
      <span className="ml-3 max-md:hidden">{title}</span>
    </Link>
  );
};
