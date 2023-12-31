"use client";
import Link from "next/link";

import { Button} from "@mui/material";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import { PropsUploadPage } from "~/app/upload/view";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavItem } from "./NavItem";
import { navList } from "~/constants";



export const Sidebar: React.FC<PropsUploadPage> = ({ session }) => {

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-darkPrimary px-5 py-8 text-white">
      <div className="relative h-full w-full">
        <h2 className="mb-14 mt-5 ">
          <AudiotrackIcon /> MusicApp
        </h2>
        <nav className="">
          {navList.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}
        </nav>

        <div className="absolute bottom-24 left-0 w-full">
          {session && (
            <Button
              startIcon={<LogoutIcon />}
              className="w-full p-2 normal-case text-white transition duration-100 ease-in-out hover:bg-mainRed"
            >
              <Link
                href={"/api/auth/signout"}
                className="text-white no-underline"
              >
                Sign Out
              </Link>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

