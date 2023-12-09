import { Wrapper } from "../../components/wrapper";
import React from "react";
import { LoginForm } from "~/app/login/loginForm";
import { getProviders } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";

const LoginPage = async (): Promise<React.JSX.Element> => {
  const providers = await getProviders();
  const session = await getServerAuthSession();
  return (
    <main className="bg-darkPrimary min-h-screen px-4 py-8">
      <Wrapper>
        <LoginForm providers={providers} session={session} />
      </Wrapper>
    </main>
  );
};

export default LoginPage;
