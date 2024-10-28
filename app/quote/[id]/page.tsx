import Offers from "@/app/(components)/Offers";
import { readData } from "@/app/(serverActions)/textDbActions";
import {
  CategoryType,
  getAllPriceList,
} from "@/app/(serverActions)/textDbPriceListActions";
import { ProductItemSelectionData, QuoteData } from "@/lib/zus-store";
import { Metadata } from "next";
import GrandTotal from "../(quote-components)/GrandTotal";
import NewForm from "../(quote-components)/NewForm";
import TableDisplay from "../(quote-components)/TableDisplay";
import UserActions from "../(quote-components)/UserActions";

export const metadata: Metadata = {
  title: "Quote",
};

type Props = {};

export type DisplayFormData = {
  name: string;
  price: number;
  qty: number;
  total: number;
};

const QuotePage = async ({ params }: { params: { id: string } }) => {
  const quoteId = params.id;

  const data = (await readData(quoteId)) as QuoteData;

  // const data2 = (await readData(quoteId)) as ProductSelectionData;

  const createDate = new Date(data.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const displayData: DisplayFormData[] = data.formData.map((data) => {
    return {
      name: data.selectedOption.name,
      price: data.selectedOption.price,
      qty: data.quantity,
      total: data.total,
    };
  });

  // console.log(displayData);

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

  return (
    <>
      <div className="mx-auto max-w-[1060px]">
        <div className="mx-auto flex w-full flex-col items-center gap-10 px-4 py-8 sm:w-4/5 sm:px-0">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2>Quotation from Ideal Tech PC</h2>
            <p>Thank you for using Ideal Tech PC Builder.</p>
            <p>Quotation generated on: {createDate}</p>
          </div>
          <div>
            <Offers />
          </div>
          <TableDisplay data={displayData} />
          <GrandTotal
            original={data.oriTotal}
            final={data.grandTotal}
            discount={data.oriTotal - data.grandTotal}
            // original={data2.ori_total}
            // final={data2.grand_total}
            // discount={data2.ori_total - data2.grand_total}
          />
          <UserActions quoteId={quoteId} data={data} dataList={dataFormList} />
          <NewForm quoteId={quoteId} />
        </div>
      </div>
      <div className="h-[200px]"></div>
    </>
  );
};

export default QuotePage;
