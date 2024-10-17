import { readData } from "@/app/(components)/QuoteDataJSON";
import TableDisplay from "../(quote-components)/TableDisplay";

type Props = {};

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

const QuotePage = async ({ params }: { params: { id: string } }) => {
  const quoteId = params.id;

  const data = await readData(quoteId);

  // console.log(data);

  return (
    <>
      <div className="mx-auto max-w-[1060px]">
        <div className="mx-auto flex w-full flex-col items-center gap-10 px-4 py-8 sm:w-4/5 sm:px-0">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2>Quotation from Ideal Tech PC</h2>
            <p>Thank you for using Ideal Tech PC Builder.</p>
            <p>Quotation generated on: </p>
          </div>
          <TableDisplay />
        </div>
      </div>
      <div className="h-[200px]"></div>
    </>
  );
};

export default QuotePage;
