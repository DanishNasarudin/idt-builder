"use client";
import { Toaster } from "@/components/ui/sonner";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import CustomClerkProvider from "./providers/clerk-provider";
import { ThemeProvider } from "./providers/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <CustomClerkProvider>
        <NextUIProvider navigate={router.push}>
          {children}
          <Toaster richColors closeButton />
        </NextUIProvider>
      </CustomClerkProvider>
    </ThemeProvider>
  );
}
