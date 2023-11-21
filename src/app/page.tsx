import { getServerSession } from "next-auth/next";
import { getProviders } from "next-auth/react";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

const Home = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();
  console.log("session ", session);
  return (
    <main>
      <div>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
    </main>
  );
};

export default Home;
