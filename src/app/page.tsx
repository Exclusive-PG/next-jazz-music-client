import { Wrapper } from "~/components/wrapper";
import { getServerAuthSession } from "~/server/auth";

import { MainPageView } from "./mainPageView";

const Home = async (): Promise<React.JSX.Element> => {
  const session = await getServerAuthSession();

  return (
    <main>
      <Wrapper>
        <MainPageView session={session} />
      </Wrapper>
    </main>
  );
};

export default Home;
