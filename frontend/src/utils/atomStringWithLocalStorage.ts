import { Nullable } from "@/types";
import { atom } from "jotai";

const isBrowser = typeof window !== "undefined";

const _localStorage = {
  getItem: (key: string) => {
    if (!isBrowser) return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (!isBrowser) return;
    localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },
};

export const atomStringWithLocalStorage = <T extends Nullable<string>>(
  key: string,
  initialValue: T,
) => {
  const stringAtom = atom((isBrowser ? _localStorage.getItem(key) : undefined) ?? initialValue);

  const stringAtomWithPersistence = atom(
    (get) => get(stringAtom),
    (_get, set, newString: T) => {
      set(stringAtom, newString);
      if (typeof newString !== "string") {
        _localStorage.removeItem(key);
      } else {
        _localStorage.setItem(key, newString);
      }
      return newString;
    },
  );

  return stringAtomWithPersistence;
};
