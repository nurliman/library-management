import { Nullable } from "@/types";
import { atomStringWithLocalStorage } from "@/utils/atomStringWithLocalStorage";

export const refreshTokenAtom = atomStringWithLocalStorage<Nullable<string>>("refresh_token", null);
