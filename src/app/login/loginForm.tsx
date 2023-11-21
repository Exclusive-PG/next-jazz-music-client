"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { type AppProps } from "next/app";
import { ILogin } from "~/validation/validAuth";
import { Button } from "@mui/material";
import { NextPage } from "next/types";
import Image from "next/image";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
type Props = {
  //providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>| null
  providers: any;
  session: Session | null;
};
//{ providers }: { providers: AppProps }
export const LoginForm: NextPage<Props> = ({ providers, session }) => {
  console.log(providers);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    console.log(data);
    await signIn("credentials", { ...data, callbackUrl: "/dashboard" });
  };
  if (session) {
    redirect("/api/auth/signout");
  }
  return (
    <div className="pt-60">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="radius flex flex-col items-center gap-2"
      >
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: true,
            maxLength: 50,
          })}
        />
        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: true,
            minLength: 3,
            maxLength: 20,
          })}
        />
        <Button variant="contained" type="submit">
          Login
        </Button>
      </form>
      <div className="flex items-center justify-center pt-4">
        {Object.values(providers)?.map(
          (item: any) =>
            item.id !== "credentials" && (
              <div className="justify-content flex ml-3">
                <Button
                  key={item.id}
                  color="primary"
                  variant="outlined"
                  aria-label="outlined primary button group"
                  onClick={async () =>
                    await signIn(item.id, { callbackUrl: "/dashboard" })
                  }
                >
                  <Image
                    alt={item.id}
                    src={`https://authjs.dev/img/providers/${item.id}.svg`}
                    height={50}
                    width={50}
                  />
                  <span className="pl-2">{item.id}</span>
                </Button>
              </div>
            ),
        )}
      </div>
    </div>
  );
};
