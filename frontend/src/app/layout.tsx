import { PropsWithChildren, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import Providers from "@/libs/providers";
import Nav from "@/components/Nav";
import Auth from "./Auth";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Library Management System",
  description: "A web-based application for managing library resources and services",
};

export default function RootLayout({ children }: PropsWithChildren<object>) {
  return (
    <Providers>
      <html lang="en" className="h-full bg-gray-50">
        <body className="h-full">
          <Suspense fallback={null}>
            <Nav />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <Auth />
          </Suspense>
          <ToastContainer position="bottom-right" />
        </body>
      </html>
    </Providers>
  );
}
