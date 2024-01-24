"use client";

import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "@/store/isAuthenticatedAtom";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import { toast } from "react-toastify";

export default function AuthProvider({ children }: PropsWithChildren<object>) {
  const router = useRouter();
  const pathname = router.pathname;
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  useEffect(() => {
    if (pathname === "/login" && isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    if (pathname !== "/login" && !isAuthenticated) {
      router.push("/login");
      toast.error("Unauthorized, Please login");
    }
  }, [isAuthenticated, pathname]);

  return <>{children}</>;
}
