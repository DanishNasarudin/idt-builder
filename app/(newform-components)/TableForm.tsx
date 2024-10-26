"use client";
import { cn, createURL } from "@/lib/utils";
import {
  ProductItemSelectionData,
  QuoteData,
  useNavbarStore,
  useUserSelected,
} from "@/lib/zus-store";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import TableDropdown from "./TableDropdown";
import TableDropdownQty from "./TableDropdownQty";

type Props = {
  data: ProductItemSelectionData[];
  dataToEdit?: QuoteData;
};

const columns = [
  {
    key: "action",
    label: "Add",
    style: "!min-w-[40px] !w-[40px] px-0 sm:px-3 [&>div]:w-min [&>div]:mx-auto",
  },
  {
    key: "products",
    label: "Products",
    style: "w-[600px]",
  },
  {
    key: "quantity",
    label: "Quantity",
    style: "w-[40px] px-0 sm:px-3 [&>div]:w-min [&>div]:mx-auto",
  },
  {
    key: "sub_total",
    label: "Total",
    style: "w-[82px] px-0 sm:px-3 [&>div]:w-min [&>div]:mx-auto",
  },
];

const TableForm = ({ data, dataToEdit }: Props) => {
  const dataClient = useUserSelected((state) => state.dynamicData);
  const initDataClient = useUserSelected((state) => state.initData);
  const addDataClient = useUserSelected((state) => state.addData);
  const delDataClient = useUserSelected((state) => state.delData);
  // const selected = useUserSelected((state) => state.selected);
  const quoteToData = useUserSelected((state) => state.quoteToData);
  const updateSelected = useUserSelected((state) => state.updateSelected);

  // console.log(selected);
  const setIsBuildPage = useNavbarStore((state) => state.setIsBuildPage);

  // Init Data for client
  React.useEffect(() => {
    if (dataClient.length === 0) {
      initDataClient(data);
    }
    setIsBuildPage(true);
  }, []);

  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const setParams = new URLSearchParams(params?.toString());

  React.useEffect(() => {
    if (dataToEdit) {
      quoteToData(dataToEdit);

      setParams.delete("edit");
      if (pathname === null) return;
      const setURL = createURL(pathname, setParams);
      router.replace(setURL);
    }
  }, [dataToEdit]);

  // console.log(dataClient);

  const disabledKeys = React.useMemo(() => {
    const newDisabledKeys = [...data].flatMap((data) =>
      data.products
        .filter((item) => item.is_label || item.product_name === "")
        .map((item) => String(item.product_id))
    );
    return newDisabledKeys;
  }, [data]);

  const renderCell = React.useCallback(
    (data: ProductItemSelectionData, columnKey: React.Key, index: number) => {
      const cellValue = data[columnKey as keyof ProductItemSelectionData];

      const currentProduct = data.products.find(
        (item) => item.product_id === data.selected_id
      );

      switch (columnKey) {
        case "action":
          return (
            <div className="relative flex justify-center !h-full">
              <Button
                className={`${
                  data.selected_id ? "block" : "hidden"
                } absolute left-[-150%] h-full w-[40px] bg-zinc-700 text-xs text-white mobilehover:hover:bg-accent`}
                isIconOnly
                size="sm"
                aria-label="copy"
                onClick={() => {
                  currentProduct?.product_name &&
                    navigator.clipboard.writeText(
                      `${currentProduct?.product_name
                        .replace(/\([^)]*\)/g, "")
                        .trim()} | RM ${currentProduct.dis_price}`
                    );
                  toast.success("Copied!");
                }}
                onKeyDown={(e) => {
                  e.preventDefault();
                  if (e.key === "Enter") {
                    if (currentProduct?.product_name) {
                      navigator.clipboard.writeText(
                        `${currentProduct?.product_name
                          .replace(/\([^)]*\)/g, "")
                          .trim()} | RM ${currentProduct.dis_price}`
                      );
                      toast.success("Copied!");
                    }
                  }
                }}
              >
                Copy
              </Button>
              {data.duplicate ? (
                <Button
                  className="text-md h-full w-[40px] bg-zinc-300 text-black mobilehover:hover:bg-red-500 mobilehover:hover:text-white"
                  isIconOnly
                  size="sm"
                  aria-label="del"
                  onClick={() => {
                    delDataClient(data.category_id);
                    updateSelected();
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.key === "Enter") {
                      delDataClient(data.category_id);
                      updateSelected();
                    }
                  }}
                >
                  -
                </Button>
              ) : (
                <Button
                  className={cn(
                    "h-full w-[40px] text-md bg-zinc-300 text-black mobilehover:hover:bg-accent mobilehover:hover:text-white"
                  )}
                  isIconOnly
                  size="sm"
                  aria-label="add"
                  onClick={() => {
                    addDataClient(data.category_id);
                    updateSelected();
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.key === "Enter") {
                      addDataClient(data.category_id);
                      updateSelected();
                    }
                  }}
                >
                  +
                </Button>
              )}
            </div>
          );
        case "products":
          return (
            <div className="flex items-center">
              <TableDropdown data={data} disabledKeys={disabledKeys} />
            </div>
          );
        case "quantity":
          return (
            <div className="flex h-full justify-center">
              <TableDropdownQty
                category_id={Number(data.category_id)}
                product_id={data.selected_id ? data.selected_id : 0}
              />
            </div>
          );
        case "sub_total":
          return (
            <div
              className={`${
                currentProduct?.is_discounted ? "font-bold text-green-500" : ""
              } text-center`}
            >
              {data.sub_total === null ? 0 : data.sub_total}
            </div>
          );
        default:
          return <div>{cellValue ? cellValue.toString() : ""}</div>;
      }
    },
    []
  );

  return (
    <>
      <Table
        aria-label="Main Table"
        isCompact
        removeWrapper
        classNames={{ th: "bg-transparent", td: "!h-[40px]" }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={cn(
                column.key === "products" ? "w-[600px]" : "",
                column.key === "sub_total"
                  ? "w-[82px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                  : "",
                column.key === "action"
                  ? "!w-[40px] !min-w-[40px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                  : "",
                column.key === "quantity"
                  ? "w-[40px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                  : ""
              )}
            >
              <div
                className={cn(
                  ["action", "quantity", "sub_total"].includes(column.key)
                    ? "flex items-center justify-center"
                    : ""
                )}
              >
                {column.label}
              </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={dataClient} emptyContent="No data.">
          {(item) => (
            <TableRow key={item.category_id}>
              {(columnKey) => (
                <TableCell
                  aria-label={String(item.category_id)}
                  className={cn(
                    columnKey === "sub_total"
                      ? "w-[82px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                      : "",
                    columnKey === "action"
                      ? "!w-[40px] !min-w-[40px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                      : "",
                    columnKey === "quantity"
                      ? "w-[40px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                      : "",
                    "h-full"
                  )}
                >
                  {renderCell(item, columnKey, item.category_id)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default TableForm;
