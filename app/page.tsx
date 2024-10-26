import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import Hero from "./(components)/Hero";
import Offers from "./(components)/Offers";
// import TableSearch from "./(newform-components)/TableSearch";
import {
  CategoryType,
  getAllPriceList,
  getLatestUpdatedTimestamp,
} from "./(serverActions)/textDbPriceListActions";

const TableSearch = dynamic(
  () => import("./(newform-components)/TableSearch"),
  {
    ssr: false,
  }
);

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

export type ProductTypeSearch = {
  category_id: number;
  category_name: string;

  product_id: number;
  product_name: string;
  ori_price: number;
  dis_price: number;
  is_label: boolean;
}[];

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

  const dataPriceList: CategoryType[] = await getAllPriceList();

  const flattenSearchData = (data: CategoryType[]): ProductTypeSearch => {
    return data.flatMap(({ category_id, category_name, products }) =>
      products.map(
        ({ product_id, product_name, ori_price, dis_price, is_label }) => ({
          category_id,
          category_name,

          product_id,
          product_name,
          ori_price,
          dis_price,
          is_label,
        })
      )
    );
  };

  // console.log(dataPriceList);
  return (
    <main className={`${inter.className} flex flex-col w-4/5 mx-auto`}>
      <Hero />
      <Offers />
      {/* <Form /> */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <h2>Choose your parts</h2>
        <p className="text-zinc-400">Price list last updated: {lastUpdated}</p>
        <TableSearch data={flattenSearchData(dataPriceList)} />
        {/* <TableForm data={flatPublicData} /> */}
      </div>
    </main>
  );
}
