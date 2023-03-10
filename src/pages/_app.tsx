import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GlobalContextProvider } from "../../Context/store";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Navbar from "../../Components/navbar";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <GlobalContextProvider>
        <Head>
          <title>Crew Up</title>
        </Head>
        <Navbar />
        <Component {...pageProps} />
      </GlobalContextProvider>
    </UserProvider>
  );
}
