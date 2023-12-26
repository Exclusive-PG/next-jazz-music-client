import { Wrapper } from "~/components/wrapper";
import { getServerAuthSession } from "~/server/auth";
import { SessionUtils } from "~/utils/session";

import { DashView } from "./view";

const DashBoard = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();
  SessionUtils.checkSession(session);
  return (<DashView session={session} />);
};

export default DashBoard;
