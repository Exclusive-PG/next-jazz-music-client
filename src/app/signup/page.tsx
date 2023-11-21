import { Wrapper } from "./../../components/wrapper";
import React from "react";
import { LoginForm } from "~/app/login/loginForm";
import { NextPage } from "next/types";
import { getProviders } from "next-auth/react";
import { SignUpForm } from "./signupForm";

const SignUpPage = async (): Promise<React.JSX.Element> => {
  return (
    <main>
      <Wrapper>
        <SignUpForm />
      </Wrapper>
    </main>
  );
};

export default SignUpPage;
