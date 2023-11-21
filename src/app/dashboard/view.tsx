"use client";

import { signOut } from "next-auth/react";
import { NextPage } from "next/types";

type Props = {
  session: any;
};
export const DashView: NextPage<Props> = ({ session }) => {
  return (
    <div>
      {session ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <div>You didn't sign in</div>
      )}
    </div>
  );
};
