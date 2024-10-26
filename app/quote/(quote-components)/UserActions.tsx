"use client";
import { createURL } from "@/lib/utils";
// import {
//   Products,
//   SelectedStore,
//   useSelectStore,
//   useTriggerStore,
// } from "@/lib/zus-store";
import { Button } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  quoteId: string;
};

const UserActions = ({ quoteId }: Props) => {
  //   const quoteData = useSelectStore((state) => state.selectedData);
  //   function generateCopySpec(data: Products[]): string {
  //     return data
  //       .map(
  //         (item) =>
  //           `${item.product_category.replace(/\d{2}\.\s/g, "").trim()}: ` +
  //           `${item.product_name.replace(/\([^)]*\)/g, "").trim()}` +
  //           `${item.qty > 1 ? " | " : ""}` +
  //           `${item.qty > 1 ? `Qty: ${item.qty}x` : ""}` +
  //           ` | ` +
  //           `RM ${item.sub_total}` +
  //           `\n`
  //       )
  //       .join("");
  //   }

  //   function generateCopySpec2(data: SelectedStore): string {
  //     if (data === null) {
  //       return "";
  //     } else {
  //       return (
  //         `${
  //           data.ori_total - data.grand_total === 0
  //             ? ""
  //             : `Total: RM ${String(data.ori_total)}`
  //         }` +
  //         `${
  //           data.ori_total - data.grand_total === 0
  //             ? ""
  //             : `\nDiscount: RM ${String(data.ori_total - data.grand_total)}`
  //         }` +
  //         `\nGrand Total: RM ${String(data.grand_total)}`
  //       );
  //     }
  //   }

  //   let copySpec =
  //     `${generateCopySpec(quoteData.products)}\n` +
  //     `${generateCopySpec2(quoteData)}`;

  //   const pdfTrigger = useTriggerStore((state) => state.trigger);
  //   const setPDFTrigger = useTriggerStore((state) => state.setTrigger);
  //   const dataToJSON = useSelectStore((state) => state.dataToJSON);
  //   const editData = useSelectStore((state) => state.editData);

  const router = useRouter();
  const pathname = usePathname();
  const setSearchParams = new URLSearchParams();
  return (
    <div className="flex gap-2">
      <Button
        radius="sm"
        onClick={() => {
          //   navigator.clipboard.writeText(copySpec);
          toast.success("Copied!");
        }}
      >
        Copy Spec
      </Button>
      <Button
        radius="sm"
        onClick={() => {
          //   setPDFTrigger(!pdfTrigger);
        }}
      >
        Print PDF
      </Button>
      <Button
        radius="sm"
        onClick={() => {
          // editData(dataToJSON());
          setSearchParams.set("edit", quoteId);
          if (pathname === null) return;
          const setURL = createURL("/", setSearchParams);
          // console.log(setURL);
          router.push(setURL);
        }}
      >
        Edit Spec
      </Button>
    </div>
  );
};

export default UserActions;
