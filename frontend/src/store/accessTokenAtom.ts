import { Nullable } from "@/types";
import { atomStringWithLocalStorage } from "@/utils/atomStringWithLocalStorage";

export const accessTokenAtom = atomStringWithLocalStorage<Nullable<string>>("access_token", null);
