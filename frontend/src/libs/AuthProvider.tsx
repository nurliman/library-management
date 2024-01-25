"use client";

import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Id, toast } from "react-toastify";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "@/store/isAuthenticatedAtom";
import { useRoutesByRole } from "@/hooks/useRoutesByRole";
import { routes } from "@/constants";
import { useMe } from "@/hooks/useMe";
import startsWith from "lodash/startsWith";

export default function AuthProvider({ children }: PropsWithChildren<object>) {
  const router = useRouter();
  const allowedRoutes = useRoutesByRole();
  const pathname = router.pathname;
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const unauthorizedToast = useRef<Id>();
  const me = useMe();

  useEffect(() => {
    if (!me?.role) return;
    if (!isAuthenticated) return;
    if (!startsWith(pathname, "/login")) return;
    router.push(allowedRoutes[0].href);
  }, [me?.role, pathname, isAuthenticated, allowedRoutes[0]]);

  useEffect(() => {
    if (isAuthenticated) return;
    if (startsWith(pathname, "/login")) return;

    router.push("/login");

    if (!unauthorizedToast.current) {
      unauthorizedToast.current = toast.error("Unauthorized, Please login");
    }
  }, [pathname, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!routes.find((route) => startsWith(pathname, route.href))) return;
    if (allowedRoutes.find((route) => startsWith(pathname, route.href))) return;
    router.push(allowedRoutes[0].href);
    toast.error("You don't have permission to access");
  }, [isAuthenticated, pathname, allowedRoutes[0]]);

  return <>{children}</>;
}
