import type { PropsWithChildren } from "react";
import Nav from "@/components/Nav";

export default function AppLayout({ children }: PropsWithChildren<object>) {
  return (
    <>
      <Nav />

      {children}
    </>
  );
}
