import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "./globals.css";

const Navbar = dynamic(() => import("./(components)/Navbar"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ideal Tech PC Builder",
  description: "Customize your own PC.",
  keywords: ["Ideal Tech", "Custom PC", "Part Picker"],
  icons: {
    icon: "https://idealtech.com.my/wp-content/uploads/2023/03/IDT_LOGO-150x150.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Navbar />
        <div className="max-w-[1060px] mx-auto">{children}</div>
        <div className="h-[200px]"></div>
      </body>
    </html>
  );
}
