import type { PropsWithChildren } from "react";
import Navbar from "@/components/Navbar";

export default function AppLayout({ children }: PropsWithChildren<object>) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}
