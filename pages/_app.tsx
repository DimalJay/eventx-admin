"use client";

import React from "react";
import { QueryProvider } from "@/providers/QueryProvider";

export default function App({ Component, pageProps }: any) {
  return (
    <QueryProvider>
      <Component {...pageProps} />
    </QueryProvider>
  );
}
