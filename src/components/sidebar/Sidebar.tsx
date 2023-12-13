"use client";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

import { type PropsUploadPage } from "~/app/upload/view";
import { navList } from "~/constants";

import { NavItem } from "./NavItem";

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
              onClick={() => signOut()}
              startIcon={<LogoutIcon />}
              className="w-full p-2 normal-case text-white transition duration-100 ease-in-out hover:bg-mainRed"
            >
              <span className="text-white no-underline">Sign Out</span>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
