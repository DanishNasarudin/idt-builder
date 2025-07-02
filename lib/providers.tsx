"use client";
import { Toaster } from "@/components/ui/sonner";
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
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NextUIProvider navigate={router.push}>
        {children}
        <Toaster richColors closeButton />
      </NextUIProvider>
    </ThemeProvider>
  );
}
