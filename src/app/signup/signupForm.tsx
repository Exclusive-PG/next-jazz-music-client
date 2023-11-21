"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { type AppProps } from "next/app";
import { ILogin } from "~/validation/validAuth";
import { Button } from "@mui/material";
import { NextPage } from "next/types";
import { api } from "./../../trpc/react";

type Props = {};

export const SignUpForm: NextPage<Props> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  const registerUser = api.user.registerUser.useMutation({
    onSuccess: (user) => {
      console.log(user);
    },
    onError: (err) => {
      console.log(err.message);
    },
  });
  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    registerUser.mutate({ ...data });
  };

  return (
    <div className="radius flex flex-col items-center gap-2 border p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-center"
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
        <Button type="submit" variant="outlined" color="primary">
          Sign Up
        </Button>
      </form>
      {registerUser.error && (
        <p>Something went wrong! {registerUser.error.message}</p>
      )}
    </div>
  );
};
