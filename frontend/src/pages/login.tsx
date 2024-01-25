"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useLoginMutation } from "@/api/auth";
import { Card, Title, Text, TextInput, Button } from "@tremor/react";
import { env } from "@/env.mjs";
import isEmail from "is-email";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    const payload = {
      username: isEmail(data.username) ? undefined : data.username,
      email: isEmail(data.username) ? data.username : undefined,
      password: data.password,
    };

    login(payload)
      .unwrap()
      .then(() => {
        toast.success("Logged in successfully");
      })
      .catch((err) => {
        if (err.status === 401) {
          setError("username", {});
          setError("password", {});
          toast.error("Invalid username or password");
        } else {
          toast.error(err.data?.message || "Something went wrong");
        }
      });
  });

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <Title>Login</Title>
      <Text>Log in to your account.</Text>

      <Card className="mt-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Text>Username/Email</Text>

            <TextInput
              placeholder="Username/Email"
              type="text"
              {...register("username")}
              error={!!errors.username?.message}
              errorMessage={errors.username?.message?.toString()}
            />
          </div>

          <div className="space-y-2">
            <Text>Password</Text>
            <TextInput
              type="password"
              placeholder="Password"
              {...register("password")}
              error={!!errors.password?.message}
              errorMessage={errors.password?.message?.toString()}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button type="submit" loading={isLoginLoading} disabled={isLoginLoading}>
              Login
            </Button>
            <Button
              type="button"
              color="gray"
              onClick={() => {
                window.location.href = `${env.NEXT_PUBLIC_BASE_URL}/auth/github`;
              }}
            >
              <div className="flex items-center space-x-2">Login with Github</div>
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
