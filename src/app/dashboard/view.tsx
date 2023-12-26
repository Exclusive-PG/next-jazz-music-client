"use client";

import { type NextPage } from "next/types";
import { type Session } from "next-auth";
import { WrapperSidebar } from "~/components/wrapperSiderbar";

type Props = {
  session: Session | null;
};
export const DashView: NextPage<Props> = ({ session }) => {
  return (
    <WrapperSidebar session={session}>
      <h3 className="my-2 text-base text-white sm:text-base lg:text-xl lg:leading-10 xl:text-2xl ">
        Dashboard
      </h3>
    </WrapperSidebar>
  );
};
