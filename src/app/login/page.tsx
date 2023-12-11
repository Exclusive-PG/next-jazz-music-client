import { getProviders } from "next-auth/react";
import React from "react";

import { Wrapper } from "../../components/wrapper";
import { LoginForm } from "~/app/login/loginForm";
import { getServerAuthSession } from "~/server/auth";

const LoginPage = async (): Promise<React.JSX.Element> => {
  const providers = await getProviders();
  const session = await getServerAuthSession();
  return (
    <main className="min-h-screen bg-darkPrimary px-4 py-8">
      <Wrapper>
        <LoginForm providers={providers} session={session} />
      </Wrapper>
    </main>
  );
};

export default LoginPage;
