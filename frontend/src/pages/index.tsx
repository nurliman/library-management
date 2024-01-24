import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Title } from "@tremor/react";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "@/store/isAuthenticatedAtom";

export default function IndexPage() {
  const router = useRouter();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => {
        if (dots === "...") {
          return ".";
        } else {
          return dots + ".";
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  });

  return <Title className="flex h-screen items-center justify-center">Redirecting{dots}</Title>;
}
