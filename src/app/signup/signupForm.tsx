"use client";

import { Button } from "@mui/material";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type LoginSchema } from "~/domains/auth/validAuth";

import { api } from "./../../trpc/react";

export const SignUpForm = () => {
  const { register, handleSubmit } = useForm<LoginSchema>();

  const registerUser = api.user.registerUser.useMutation();

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    try {
      registerUser.mutateAsync({ ...data });
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center gap-2 border p-4">
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
