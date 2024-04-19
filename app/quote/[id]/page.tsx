"use client";
import Footer from "@/app/(main-components)/Footer";
import { LogoIcon } from "@/app/(main-components)/Icons";
import { drizzlePullQuote } from "@/app/(serverActions)/drizzleCmd";
import {
  useLoadingStore,
  useNavbarStore,
  useSelectStore,
} from "@/lib/zus-store";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";
import GrandTotal from "../(quote-components)/GrandTotal";
import Installments from "../(quote-components)/Installments";
import NewForm from "../(quote-components)/NewForm";
import TableDisplay from "../(quote-components)/TableDisplay";
import UserActions from "../(quote-components)/UserActions";

const Navbar = dynamic(() => import("@/app/(main-components)/Navbar"), {
  ssr: false,
});

interface FormDataItem {
  category: string;
  selectedOption: { name: string; price: number };
  quantity: number;
  total: number;
}

interface QuoteData {
  id: string;
  formData: FormDataItem[];
  grandTotal: number;
  oriTotal: number;
  createdAt: string;
}

const Quote = ({ params }: { params: { id: string } }) => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const [quoteId, setQuoteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const pathArray = params.id!.split("/");
    const id = pathArray[pathArray.length - 1];
    if (id) {
      setQuoteId(id);
    }
  }, [params.id]);

  const JSONToData = useSelectStore((state) => state.JSONToData);
  const data = useSelectStore((state) => state.selectedData);
  const setIsBuildPage = useNavbarStore((state) => state.setIsBuildPage);

  const router = useRouter();

  React.useEffect(() => {
    const getData = async () => {
      if (quoteId !== null) {
        // console.log("pass");
        const json = await drizzlePullQuote(quoteId);
        if (json === null) {
          router.push(`/quote-old/${quoteId}`);
          return;
        }
        JSONToData(json);
        setIsLoading(false);
      }
    };
    getData();
  }, [quoteId]);

  React.useEffect(() => {
    setIsBuildPage(false);
  }, []);

  // const pathname = usePathname();
  // const searchParams = useSearchParams();

  if (isLoading) {
    return (
      <div className="flex h-[100vh] flex-col items-center justify-center gap-2 text-center">
        <LogoIcon className="animate-[spin_2s_linear_infinite]" size={100} />
        <h2>Loading...</h2>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-[1060px]">
        <div className="mx-auto flex w-full flex-col items-center gap-10 px-4 py-8 sm:w-4/5 sm:px-0">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2>Quotation from Ideal Tech PC</h2>
            <p>Thank you for using Ideal Tech PC Builder.</p>
            <p>Quotation generated on: {data.createdAt}</p>
          </div>
          <TableDisplay />
          <GrandTotal />
          <UserActions quoteId={quoteId === null ? "" : quoteId} />
          <Installments />
          <NewForm quoteId={quoteId} />
        </div>
      </div>
      <div className="h-[200px]"></div>
      <Footer />
    </>
  );
};

export default Quote;
