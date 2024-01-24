import { useMemo } from "react";
import { routes } from "@/constants";
import { useGetMeQuery } from "@/api/users";
import { useRouter } from "next/router";
import { useAppSelector } from "./redux";

export type UseRoutesByRoleOptions = {
  ignoreRoutes?: string[];
};

export const useRoutesByRole = ({ ignoreRoutes = ["/login"] }: UseRoutesByRoleOptions = {}) => {
  const router = useRouter();
  const userState = useAppSelector((state) => state.auth.user);
  const { data: user = userState } = useGetMeQuery(undefined, {
    skip: !!userState || ignoreRoutes.includes(router.pathname),
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const routesByRole = useMemo(() => {
    if (!user) return routes;
    return routes.filter((route) => {
      if (!route.roles) return true;
      return route.roles.includes(user.role);
    });
  }, [user]);

  return routesByRole;
};
