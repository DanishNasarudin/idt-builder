"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          footer: "hidden",
        },
      }}
    >
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    </ClerkProvider>
  );
}
