import { inter } from "@/lib/font";
import { Providers } from "@/lib/providers/providers";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const Navbar = dynamic(() => import("./(main-components)/Navbar"), {
  ssr: false,
});

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? `https://${process.env.HOSTNAME}`
      : "http://localhost:3000",
  ),
  title: "Ideal Tech PC Builder",
  description:
    "Custom PC, Desktop PC, Gaming PC, Workstation PC built for your needs in Malaysia. Fully Customizable.",
  keywords: [
    "Ideal Tech",
    "Custom PC",
    "Part Picker",
    "Ideal Tech PC",
    "Gaming PC",
    "Desktop PC",
    "PC Gaming Malaysia",
    "PC Builder Malaysia",
    "Custom PC Malaysia",
    "Workstation PC",
    "Custom Computers",
  ],
  icons: {
    icon: "/icon?<generated>",
  },
  appleWebApp: true,
  openGraph: {
    title: "Ideal Tech PC Builder",
    description:
      "Custom PC, Desktop PC, Gaming PC, Workstation PC built for your needs in Malaysia. Fully Customizable.",
    images: [
      {
        url: "https://idealtech.com.my/wp-content/uploads/2023/07/01_Artwork-PC.png",
        width: 1000,
        height: 1000,
        alt: "Ideal Tech Custom PC",
      },
      {
        url: "https://idealtech.com.my/wp-content/uploads/2023/03/IDT_LOGO-150x150.png",
        width: 1000,
        height: 1000,
        alt: "Ideal Tech Gaming PC",
      },
    ],
  },
};

const GTM_ID = "G-F1BXD9F7PC";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`} />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${GTM_ID}');
          `}
      </Script>
      <body className={`${inter.className} relative`}>
        <Suspense>
          <Providers>
            {/* <Navbar />
          <div className="max-w-[1060px] mx-auto">{children}</div>
          <div className="h-[200px]"></div>
          <Footer /> */}
            {children}
            <Toaster richColors closeButton theme="dark" />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
