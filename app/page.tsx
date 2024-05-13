import { db } from "@/db/db";
import { product } from "@/db/schema";
import { desc } from "drizzle-orm";
import Footer from "./(main-components)/Footer";
import Hero from "./(main-components)/Hero";
import Navbar from "./(main-components)/Navbar";
import Offers from "./(main-components)/Offers";
import TableForm from "./(newform-components)/TableForm";
import TableSearch from "./(newform-components)/TableSearch";

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

export type ProductData = {
  id: number;
  name: string | null;
  sort_val: number;
  product: {
    id: number;
    product_name: string | null;
    ori_price: number | null;
    dis_price: number | null;
    is_available: boolean | null;
    is_label: boolean | null;
    category_id: bigint;
    sort_val: number;
    is_soldout: boolean;
  }[];
}[];
export type ProductPublicData = {
  category_id: number;
  category_name: string | null;
  product: {
    product_id: number;
    product_name: string | null;
    unit_price: number | null;
    is_label: boolean | null;
    discount?: number | undefined;
    sort_val: number;
    is_soldout: boolean;
  }[];
  qty: number | null;
  sub_total: number | null;
  selected_id: number | undefined;
  discount?: number;
  duplicate?: boolean;
}[];

export type ProductPublicSearchData = {
  category_id: number;
  category_name: string | null;
  product_id: number;
  product_name: string | null;
  ori_price: number | null;
  dis_price: number | null;
  is_available?: boolean | null;
  is_label: boolean | null;
  is_soldout: boolean;
  ignore_id?: bigint;
}[];

const flattenData = (data: ProductData): ProductPublicData => {
  // console.log("flat");
  return data
    .sort((a, b) => a.sort_val - b.sort_val)
    .map(({ id, name, product }) => {
      return {
        category_id: id,
        category_name: name,
        product: product
          .map(
            ({
              id: productId,
              product_name,
              is_label,
              dis_price,
              ori_price,
              sort_val,
              is_soldout,
            }) => {
              const original = ori_price !== null ? ori_price : 0;
              const discount = dis_price !== null ? dis_price : 0;
              const unit_price = discount > 0 ? discount : original;
              return {
                product_id: productId,
                product_name,
                unit_price,
                is_label,
                discount: discount > 0 ? original - discount : 0,
                sort_val,
                is_soldout,
              };
            },
          )
          .sort((a, b) => a.sort_val - b.sort_val),
        qty: 0,
        sub_total: 0,
        selected_id: undefined,
        discount: 0,
        duplicate: false,
      };
    });
};

const containsSearchTerm = (value: any, searchTerm: string): boolean => {
  if (typeof value === "string") {
    const terms = searchTerm.split(" ");

    return terms.every((term) =>
      value.toLowerCase().includes(term.toLowerCase()),
    );
  } else if (Array.isArray(value)) {
    return value.some((item) => containsSearchTerm(item, searchTerm));
  } else if (typeof value === "object" && value !== null) {
    return Object.values(value).some((innerValue) =>
      containsSearchTerm(innerValue, searchTerm),
    );
  }
  return false;
};

const NewForm = async ({ searchParams }: Props) => {
  const data = await db.query.product_category.findMany({
    with: {
      product: {
        where: (product, { eq }) => eq(product.is_available, true),
      },
    },
  });

  const timeUpdated = await db
    .select()
    .from(product)
    .orderBy(desc(product.updatedAt))
    .limit(1);

  let flatPublicData = flattenData(data);

  const disabledKeys = [...data].flatMap((data) =>
    data.product.filter((item) => item.is_label).map((item) => String(item.id)),
  );

  // console.log(data);

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-[1060px]">
        <main className={`mx-auto flex w-full flex-col px-4 sm:w-4/5 sm:px-0`}>
          <Hero />
          <Offers />
          {/* <Form data={data} /> */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <h2>Choose your parts</h2>
            <p className="text-zinc-400">
              Price list last updated:{" "}
              {new Date(
                timeUpdated[0] !== undefined &&
                timeUpdated[0].updatedAt !== null
                  ? timeUpdated[0].updatedAt
                  : 0,
              ).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "GMT",
              })}
            </p>
            <TableSearch disabledKeys={disabledKeys} data={data} />
            <TableForm data={flatPublicData} />
          </div>
        </main>
      </div>
      <div className="h-[200px]"></div>
      <Footer />
    </>
  );
};

export default NewForm;
