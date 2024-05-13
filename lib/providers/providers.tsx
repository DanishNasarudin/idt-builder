"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NextUIProvider } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAdminStore } from "../zus-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const { selectColumn } = useAdminStore();

  // React.useEffect(() => {
  //   if (path.split("/")[1] === "admin") {
  //     document.body.style.overflowY = "hidden";
  //   }
  // }, [path]);

  React.useEffect(() => {
    const checkAdminBulkEdit = () => {
      if (selectColumn === true && path.split("/")[1] === "admin") {
        document.body.style.overflowY = "auto";
      } else if (selectColumn === false && path.split("/")[1] === "admin") {
        document.body.style.overflowY = "hidden";
      }
    };
    checkAdminBulkEdit();
  }, [selectColumn]);

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
