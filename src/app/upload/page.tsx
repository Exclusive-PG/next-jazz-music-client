import { useAudioContext } from "~/app/contexts/audio/provider";
import { getServerAuthSession } from "~/server/auth";

import { UploadView } from "./view";

const UploadPage = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();
  return <UploadView session={session} />;
};

export default UploadPage;
