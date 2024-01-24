"use client";

import type { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as JotaiProvider } from "jotai";
import { reduxstore, jotaiStore } from "@/store";
import AuthProvider from "./AuthProvider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <JotaiProvider store={jotaiStore}>
      <ReduxProvider store={reduxstore}>
        <AuthProvider>{children}</AuthProvider>
      </ReduxProvider>
    </JotaiProvider>
  );
}
