import { Inter } from "next/font/google";
import Form from "./(components)/Form";
import Hero from "./(components)/Hero";
import Offers from "./(components)/Offers";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${inter.className} flex flex-col w-4/5 mx-auto`}>
      <Hero />
      <Offers />
      <Form />
    </main>
  );
}
