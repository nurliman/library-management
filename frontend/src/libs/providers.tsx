"use client";

import type { PropsWithChildren } from "react";

import ReduxProvider from "@/libs/ReduxProvider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <ReduxProvider>{children}</ReduxProvider>
    </>
  );
}
