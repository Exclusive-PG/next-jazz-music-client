import { Wrapper } from "~/components/wrapper";
import { getServerAuthSession } from "~/server/auth";
import { SessionUtils } from "~/utils/session";

import { DashView } from "./view";

const DashBoard = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();
  SessionUtils.checkSession(session);
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
