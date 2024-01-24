import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import Providers from "@/libs/providers";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Providers>{getLayout(<Component {...pageProps} />)}</Providers>
      <ToastContainer position="bottom-right" />
    </>
  );
}
