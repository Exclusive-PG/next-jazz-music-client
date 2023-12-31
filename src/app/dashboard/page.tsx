import { getProviders } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import { DashView } from "./view";
import { Wrapper } from "~/components/wrapper";

const DashBoard = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();
  return (
    <div className="radius flex flex-col items-center gap-2 border p-4">
      <main>
        <Wrapper>
          <DashView session={session} />
        </Wrapper>
      </main>
    </div>
  );
};

export default DashBoard;
