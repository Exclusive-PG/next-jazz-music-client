import { getServerAuthSession } from "~/server/auth";
import { SessionUtils } from "~/utils/session";

import { UploadView } from "./view";

const UploadPage = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();
  SessionUtils.checkSession(session);
  return <UploadView session={session} />;
};

export default UploadPage;
