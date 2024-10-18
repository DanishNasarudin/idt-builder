"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { ThemeProvider } from "./theme-provider";

type Props = {};

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    </ThemeProvider>
  );
}
