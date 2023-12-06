import { getServerSession } from "next-auth/next";
import { getProviders } from "next-auth/react";
import Link from "next/link";
import { Wrapper } from "~/components/wrapper";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/react";

const Home = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();
  return (
    <main>
      <Wrapper>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20 "
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </Wrapper>
    </main>
  );
};

export default Home;
