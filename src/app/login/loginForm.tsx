"use client";

import { Button } from "@mui/material";
import Image from "next/image";
import { type NextPage } from "next/types";
import { type Session } from "next-auth";
import { type BuiltInProviderType } from "next-auth/providers";
import {
  type ClientSafeProvider,
  type LiteralUnion,
  signIn,
} from "next-auth/react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type LoginSchema } from "~/domains/auth/validAuth";

type Props = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
  session: Session | null;
};

export const LoginForm: NextPage<Props> = ({ providers }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>();

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    await signIn("credentials", { ...data, callbackUrl: "/dashboard" });
  };
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
        {providers !== null &&
          Object.values(providers)?.map(
            (item: any) =>
              item.id !== "credentials" && (
                <div className="justify-content ml-3 flex" key={item.id}>
                  <Button
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
