"use client";

import { type NextPage } from "next/types";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type Props = {
  session: Session | null;
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
