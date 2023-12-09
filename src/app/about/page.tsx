import { Wrapper } from "../../components/wrapper";
import { AboutView } from "./view";

const AboutPage: React.FC = () => {
  return (
    <main className="bg-gradient-to-r from-slate-900">
      <Wrapper>
        <AboutView />
      </Wrapper>
    </main>
  );
};

export default AboutPage;
