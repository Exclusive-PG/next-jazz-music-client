"use client";
import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { type Session } from "next-auth";

type mainPageProps = {
  session: Session | null;
};

// TO DO: complete the page (styles)
export const MainPageView: React.FC<mainPageProps> = ({ session }) => {
  return (
    <main>
      <div className="absolute left-0 top-0 z-0 h-full w-full bg-darkSecondary/[.5] "></div>
      <Image
        src="/main.jpg"
        alt="main"
        sizes="100%"
        layout="fill"
        objectFit="cover"
        className="absolute left-0 top-0 z-[-1]"
      />
      <div className="absolute z-10 flex min-h-screen flex-col justify-center">
        <h1 className="text-8xl text-white">Music App</h1>
        <div className="mt-5 flex gap-3">
          {!session && (
            <Button
              className="rounded-md border-2 border-textSecondary text-5xl  hover:border-mainRed hover:bg-mainRed hover:text-white"
              variant="outlined"
            >
              <Link
                href={"/login"}
                className="px-10 py-2 normal-case text-white no-underline"
              >
                Sign in
              </Link>
            </Button>
          )}
          <Button
            className="rounded-md border-2 border-textSecondary text-5xl text-textSecondary hover:border-mainRed hover:bg-mainRed hover:text-white"
            variant="outlined"
          >
            <Link
              href={"/signup"}
              className="px-10 py-2 normal-case  text-white no-underline"
            >
              Sign up
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};
