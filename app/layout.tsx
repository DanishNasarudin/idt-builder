import Navbar from "@/components/custom/navbar";
import { Providers } from "@/lib/providers";
import cover from "@/public/Cover.webp";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import Footer from "../components/custom/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://build.idealtech.com.my"),
  title: {
    default: "Ideal Tech PC Builder",
    template: "%s | Ideal Tech PC Builder",
  },
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
    icon: "/icon.png",
  },
  appleWebApp: true,
  openGraph: {
    title: "Ideal Tech PC Builder",
    description:
      "Custom PC, Desktop PC, Gaming PC, Workstation PC built for your needs in Malaysia. Fully Customizable.",
    images: [
      {
        url: cover.src,
        width: 1000,
        height: 1000,
        alt: "Ideal Tech Custom PC",
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
        <Providers>
          <Navbar />
          <div className="max-w-[1060px] mx-auto">{children}</div>
          <div className="h-[200px]"></div>
          <Toaster richColors closeButton theme="dark" />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
