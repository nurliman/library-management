"use client";

import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const session = null;

  if (pathname === "/login") return null;

  return <Navbar user={session} />;
}
