"use client";

import type { PropsWithChildren } from "react";
import ReduxProvider from "@/libs/ReduxProvider";
import AuthProvider from "./AuthProvider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ReduxProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReduxProvider>
  );
}
