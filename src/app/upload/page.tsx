import { getServerAuthSession } from "~/server/auth";
import { Wrapper } from "~/components/wrapper";
import { UploadView } from "./view";
import { Sidebar } from "~/components/sidebar";
const UploadPage = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();
  return <UploadView session={session} />;
};

export default UploadPage;
