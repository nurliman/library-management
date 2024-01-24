import { useGetMeQuery } from "@/api/users";
import { useAppSelector } from "./redux";

export const useMe = () => {
  const meState = useAppSelector((state) => state.auth.user);
  const { data: me = meState } = useGetMeQuery(undefined, {
    skip: !!meState,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  return me;
};
