import { Inter } from "next/font/google";
import Hero from "./(components)/Hero";
import Offers from "./(components)/Offers";
import { getLatestUpdatedTimestamp } from "./(serverActions)/QuoteDataJSON";

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  const timeUpdated = await getLatestUpdatedTimestamp();
  const lastUpdated =
    timeUpdated != null
      ? timeUpdated.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "GMT",
        })
      : "";
  return (
    <main className={`${inter.className} flex flex-col w-4/5 mx-auto`}>
      <Hero />
      <Offers />
      {/* <Form /> */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <h2>Choose your parts</h2>
        <p className="text-zinc-400">Price list last updated: {lastUpdated}</p>
        {/* <TableSearch disabledKeys={disabledKeys} data={data} /> */}
        {/* <TableForm data={flatPublicData} /> */}
      </div>
    </main>
  );
}
