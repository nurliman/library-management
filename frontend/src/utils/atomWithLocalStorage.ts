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

export const atomWithLocalStorage = <T = Nullable<string>>(key: string, initialValue: T) => {
  const getInitialValue = () => {
    const item = _localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue = typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      _localStorage.setItem(key, JSON.stringify(nextValue));
    },
  );
  return derivedAtom;
};
