import { ProductItemSelectionData, QuoteData } from "@/lib/zus-store";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import Hero from "./(components)/Hero";
import Offers from "./(components)/Offers";
import { readData } from "./(serverActions)/textDbActions";
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

const TableForm = dynamic(() => import("./(newform-components)/TableForm"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export type ProductTypeSearch = {
  category_id: number;
  category_name: string;

  product_id: number;
  product_name: string;
  ori_price: number;
  dis_price: number;
  is_label: boolean;
  is_discounted: boolean;
}[];

const flattenSearchData = (data: CategoryType[]): ProductTypeSearch => {
  return data.flatMap(({ category_id, category_name, products }) =>
    products.map(
      ({
        product_id,
        product_name,
        ori_price,
        dis_price,
        is_label,
        is_discounted,
      }) => ({
        category_id,
        category_name,

        product_id,
        product_name,
        ori_price,
        dis_price,
        is_label,
        is_discounted,
      })
    )
  );
};

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Home({ searchParams }: Props) {
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

  const dataFormList: ProductItemSelectionData[] = dataPriceList.map((item) => {
    return {
      ...item,
      qty: 0,
      sub_total: 0,
      selected_id: undefined,
      duplicate: false,
      discount: 0,
    };
  });

  let dataToEdit: QuoteData | undefined = undefined;

  const searchTerm = Array.isArray(searchParams.edit)
    ? searchParams.edit[0]
    : searchParams.edit;

  if (searchTerm) {
    dataToEdit = await readData(searchTerm);
  }

  // console.log(dataPriceList);
  return (
    <main className={`mx-auto flex w-full flex-col px-4 sm:w-4/5 sm:px-0`}>
      <Hero />
      <Offers />
      {/* <Form /> */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <h2>Choose your parts</h2>
        <p className="text-zinc-400">Price list last updated: {lastUpdated}</p>
        <TableSearch data={flattenSearchData(dataPriceList)} />
        <TableForm data={dataFormList} dataToEdit={dataToEdit} />
      </div>
    </main>
  );
}
