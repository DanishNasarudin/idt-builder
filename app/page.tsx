import { Inter } from "next/font/google";
import Hero from "./(components)/Hero";
import Offers from "./(components)/Offers";
import {
  getAllPriceList,
  getLatestUpdatedTimestamp,
} from "./(serverActions)/textDbPriceListActions";

const inter = Inter({ subsets: ["latin"] });

export type FormDataItem = {
  category: string;
  selectedOption: { name: string; price: number };
  quantity: number;
  total: number;
};

export type QuoteData = {
  id: string;
  formData: FormDataItem[];
  grandTotal: number;
  oriTotal: number;
  createdAt: string;
};

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

  const dataPriceList = await getAllPriceList();

  // console.log(dataPriceList);
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
