import { Session } from "next-auth";
import { Sidebar } from "./sidebar/Sidebar";

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export const WrapperSidebar = ({ children, session }: Props) => {
  return (
    <main className="bg-darkSecondary text-white">
      <Sidebar session={session} />
      <div className="ml-72 h-screen max-w-full p-4 max-md:ml-24">
        {children}
      </div>
    </main>
  );
};
