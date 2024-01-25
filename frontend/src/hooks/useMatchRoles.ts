import { useMemo } from "react";
import { useMe } from "./useMe";
import { UserRoles } from "@/types";
import some from "lodash/some";

export const useMatchRoles = (roles: UserRoles[], defaults = false) => {
  const me = useMe();
  const match = useMemo(() => {
    if (!me?.role) return defaults;
    return some(roles, (role) => me.role === role);
  }, [me, roles, defaults]);
  return match;
};
