import { atomWithLocalStorage } from "@/utils/atomWithLocalStorage";

export const isAuthenticatedAtom = atomWithLocalStorage("is_auth", false);
