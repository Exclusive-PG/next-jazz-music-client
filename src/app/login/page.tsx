import { Wrapper } from "./../../components/wrapper";
import React from "react";
import { LoginForm } from "~/app/login/loginForm";
import { NextPage } from "next/types";
import { getProviders } from "next-auth/react";
import { type AppProps } from "next/app";
import { BuiltInProviderType } from "next-auth/providers";
import { getServerAuthSession } from "~/server/auth";

const LoginPage = async (): Promise<React.JSX.Element> => {
  const providers = await getProviders();
  const session = await getServerAuthSession();
  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8">
      <Wrapper>
        <LoginForm providers={providers} session={session} />
      </Wrapper>
    </main>
  );
};

export default LoginPage;
