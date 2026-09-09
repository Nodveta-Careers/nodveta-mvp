import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/nodemeta-logo.png" />
        <meta
          name="description"
          content="Node Meta — Web3 infrastructure ecosystem on BNB Smart Chain. https://node-meta.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&family=Roboto+Mono:wght@100&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
