"use client";
import { createURL } from "@/lib/utils";
import {
  ProductItemSelectionData,
  ProductSelectionData,
  QuoteData,
  useTriggerStore,
  useUserSelected,
} from "@/lib/zus-store";
import { Button } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type Props = {
  quoteId: string;
  data?: QuoteData;
  dataList: ProductItemSelectionData[];
};

const UserActions = ({ quoteId, data, dataList }: Props) => {
  const quoteToData = useUserSelected((state) => state.quoteToData);

  const checkOldQuote = data?.retainFormatData;

  React.useEffect(() => {
    if (data && checkOldQuote) {
      quoteToData(data);
    } else if (data && !checkOldQuote) {
      router.push(`/quote-old/${quoteId}`);
    }
  }, [data]);

  const quoteData = useUserSelected((state) => state.selected);

  // console.log(Object.keys(quoteData).length === 0, " CHECKCE");

  function generateCopySpec(data: ProductItemSelectionData[]): string {
    return data
      .map(
        (item) =>
          `${item.category_name.replace(/\d{2}\.\s/g, "").trim()}: ` +
          `${item.products[0].product_name.replace(/\([^)]*\)/g, "").trim()}` +
          `${item.qty > 1 ? " | " : ""}` +
          `${item.qty > 1 ? `Qty: ${item.qty}x` : ""}` +
          ` | ` +
          `RM ${item.sub_total}` +
          `\n`
      )
      .join("");
  }

  function generateCopySpec2(data: ProductSelectionData): string {
    if (data === null) {
      return "";
    } else {
      return (
        `${
          data.ori_total - data.grand_total === 0
            ? ""
            : `Total: RM ${String(data.ori_total)}`
        }` +
        `${
          data.ori_total - data.grand_total === 0
            ? ""
            : `\nDiscount: RM ${String(data.ori_total - data.grand_total)}`
        }` +
        `\nGrand Total: RM ${String(data.grand_total)}`
      );
    }
  }

  let copySpec: string;

  if (!(Object.keys(quoteData).length === 0)) {
    copySpec =
      `${generateCopySpec(quoteData.product_items)}\n` +
      `${generateCopySpec2(quoteData)}`;
  }

  const pdfTrigger = useTriggerStore((state) => state.trigger);
  const setPDFTrigger = useTriggerStore((state) => state.setTrigger);

  const router = useRouter();
  const pathname = usePathname();
  const setSearchParams = new URLSearchParams();
  return (
    <div className="flex gap-2">
      <Button
        radius="sm"
        onClick={() => {
          navigator.clipboard.writeText(copySpec);
          toast.success("Copied!");
        }}
      >
        Copy Spec
      </Button>
      <Button
        radius="sm"
        onClick={() => {
          setPDFTrigger(!pdfTrigger);
        }}
      >
        Print PDF
      </Button>
      <Button
        radius="sm"
        onClick={() => {
          setSearchParams.set("edit", quoteId);
          if (pathname === null) return;
          const setURL = createURL("/", setSearchParams);
          router.push(setURL);
        }}
      >
        Edit Spec
      </Button>
    </div>
  );
};

export default UserActions;
