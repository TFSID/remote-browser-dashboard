"use client";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className="min-h-screen p-5 bg-gradient-to-br from-indigo-500 to-purple-700">
      <Component {...pageProps} />
    </main>
  );
}