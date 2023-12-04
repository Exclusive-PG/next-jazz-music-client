import { getServerAuthSession } from "~/server/auth";
import { Wrapper } from "~/components/wrapper";
import { UploadView } from "./view";

const UploadPage = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();
  return (
    <main>
      <Wrapper>
        <UploadView session={session} />
      </Wrapper>
    </main>
  );
};

export default UploadPage;
