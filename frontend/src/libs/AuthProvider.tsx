"use client";

import { useAppSelector } from "@/hooks/redux";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function AuthProvider({ children }: PropsWithChildren<object>) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (pathname === "/login" && isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    if (pathname !== "/login" && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, pathname]);

  return <>{children}</>;
}
