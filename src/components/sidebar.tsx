"use client"
import { NextPage } from "next";
import Link from "next/link";
import HouseIcon from "@mui/icons-material/House";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SvgIconProps } from "@mui/material";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import { usePathname,useRouter } from "next/navigation";

type Props = {
  id: number;
  title: string;
  link: string;
  icon: React.ReactElement<SvgIconProps>;
};

export const Sidebar: React.FC = () => {
  const navList: Array<Props> = [
    { id: 1, title: "Home", link: "/", icon: <HouseIcon /> },
    {
      id: 2,
      title: "Upload music",
      link: "/upload",
      icon: <CloudUploadIcon />,
    },
  ];
  //fixed left-0 top-0
  return (
    <aside className=" h-full w-72 bg-darkPrimary px-5 py-8 text-white">
      <h2 className="mb-14 mt-5 ">
        <AudiotrackIcon /> MusicApp
      </h2>
      <nav className="">
        {navList?.map((item) => <NavItem key={item.id} {...item}/>)}
      </nav>
    </aside>
  );
};

export const NavItem: React.FC<Props> = ({ title, icon, link }) => {
  const currentRoute = usePathname();
  const router = useRouter();
  //Next/Link doesn't stop audio
  return (
    <a
      href={link}
      className={`decoration my-3 flex list-none items-center rounded-md px-2 py-4 text-white no-underline transition duration-100 ease-in-out ${
        currentRoute === link ? "bg-mainRed" : "hover:bg-mainRed"
      }`}
    >
      {icon}
      <span className="ml-3">{title}</span>
    </a>
  );
};
