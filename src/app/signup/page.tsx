
import React from "react";
import { Wrapper } from "../../components/wrapper";
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
