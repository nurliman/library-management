import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Library Management System</title>
        <meta
          name="description"
          content="A web-based application for managing library resources and services"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
