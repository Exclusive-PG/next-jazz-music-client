import { getProviders } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import { DashView } from "./view";
import { api } from "./../../trpc/server";

const DashBoard = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();
  // const data = await api.user.hello.query({text:"aaaa"})
  console.log("session ", session);
  return (
    <div className="radius flex flex-col items-center gap-2 border p-4">
      <main>
        <div>
          <DashView session={session} />
          {/* <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          > */}

          {/* </Link> */}
        </div>
      </main>
    </div>
  );
};

export default DashBoard;
