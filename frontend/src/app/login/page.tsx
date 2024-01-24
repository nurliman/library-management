"use client";

import { Card, Title, Text, TextInput, Button } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useLoginMutation } from "@/api/auth";
import isEmail from "is-email";

// export const dynamic = "force-dynamic";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

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
        router.push("/dashboard");
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

      <Card className="mt-6 space-y-4">
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

        <Button type="button" onClick={onSubmit} loading={isLoginLoading} disabled={isLoginLoading}>
          Login
        </Button>
      </Card>
    </main>
  );
}
