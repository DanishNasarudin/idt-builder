"use client";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import { createURL } from "@/lib/utils";
import { useNavbarStore, useSelectStore } from "@/lib/zus-store";
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
import { drizzlePullQuote } from "../(serverActions)/drizzleCmd";
import { ProductPublicData } from "../page";
import TableDropdown from "./TableDropdown";
import TableDropdownQty from "./TableDropdownQty";

type Props = {
  data: ProductPublicData;
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

type ClientSideExtension = {
  unit_price: number;
  qty: number;
  sub_total: number;
};

type ExtendedProduct = {
  id: number;
  product_name: string | null;
  ori_price: number | null;
  dis_price: number | null;
} & ClientSideExtension;

export type ExtendedProductPublicData = {
  id: number;
  name: string | null;
  product: ExtendedProduct[];
}[];

const TableForm = ({ data }: Props) => {
  const dataClient = useSelectStore((state) => state.data);
  const initDataClient = useSelectStore((state) => state.initData);
  const addDataClient = useSelectStore((state) => state.addData);
  const delDataClient = useSelectStore((state) => state.delData);
  const selected = useSelectStore((state) => state.selected);
  const dataToJSON = useSelectStore((state) => state.dataToJSON);
  const editData = useSelectStore((state) => state.editData);
  const setIsBuildPage = useNavbarStore((state) => state.setIsBuildPage);

  // Init Data for client
  React.useEffect(() => {
    if (dataClient.length === 0) {
      // console.log("pass");
      initDataClient(data);
      setIsBuildPage(true);
    }
  }, []);

  // console.log(dataClient);

  const disabledKeys = React.useMemo(() => {
    const newDisabledKeys = [...data].flatMap((data) =>
      data.product
        .filter((item) => item.is_label || item.product_name === "")
        .map((item) => String(item.product_id)),
    );
    return newDisabledKeys;
  }, [data]);

  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const setParams = new URLSearchParams(params?.toString());

  React.useEffect(() => {
    const getData = async (id: string | null) => {
      if (id === null) return;
      try {
        const json = await drizzlePullQuote(id);
        editData(json);
        toast.success("Data ready to edit.");
        setParams.delete("edit");
        if (pathname === null) return;
        const setURL = createURL(pathname, setParams);
        router.replace(setURL);
      } catch (error) {
        console.log(error);
      }

      // console.log(setParams.get("edit"));
    };
    if (setParams.get("edit")) {
      getData(setParams.get("edit"));
    }
  }, [params]);

  const renderCell = React.useCallback(
    (data: ProductPublicData[0], columnKey: React.Key) => {
      const cellValue = data[columnKey as keyof ProductPublicData[0]];

      const currentProduct = data.product.find(
        (item) => item.product_id === data.selected_id,
      );

      switch (columnKey) {
        case "action":
          return (
            <div className="relative flex justify-center">
              <Button
                className={`${
                  data.selected_id ? "block" : "hidden"
                } absolute left-[-150%] h-[40px] w-[40px] bg-zinc-700 text-xs text-white mobilehover:hover:bg-accent`}
                isIconOnly
                size="sm"
                aria-label="copy"
                onClick={() => {
                  currentProduct?.product_name &&
                    navigator.clipboard.writeText(
                      `${currentProduct?.product_name
                        .replace(/\([^)]*\)/g, "")
                        .trim()} | RM ${currentProduct.unit_price}`,
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
                          .trim()} | RM ${currentProduct.unit_price}`,
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
                  className="text-md h-[40px] w-[40px] bg-zinc-300 text-black mobilehover:hover:bg-red-500 mobilehover:hover:text-white"
                  isIconOnly
                  size="sm"
                  aria-label="del"
                  onClick={() => delDataClient(data.category_id)}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.key === "Enter") {
                      delDataClient(data.category_id);
                    }
                  }}
                >
                  -
                </Button>
              ) : (
                <Button
                  className="text-md h-[40px] w-[40px] bg-zinc-300 text-black mobilehover:hover:bg-accent mobilehover:hover:text-white"
                  isIconOnly
                  size="sm"
                  aria-label="add"
                  onClick={() => addDataClient(data.category_id)}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.key === "Enter") {
                      addDataClient(data.category_id);
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
              <TableDropdown
                data={data}
                disabledKeys={disabledKeys}
                // tableHeight={tableHeight}
              />
            </div>
          );
        // return (
        //   <Autocomplete
        //     defaultFilter={customFilter}
        //     aria-label={String(data.name)}
        //     defaultItems={data.product}
        //     disabledKeys={disabledKeys}
        //   >
        //     {(item) => (
        //       <AutocompleteItem key={item.id}>
        //         {item.product_name}
        //       </AutocompleteItem>
        //     )}
        //   </Autocomplete>
        // );
        case "quantity":
          return (
            <div className="flex justify-center">
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
                data.discount ? "font-bold text-green-500" : ""
              } text-center`}
            >
              {data.sub_total === null ? 0 : data.sub_total}
            </div>
          );
        default:
          return <div>{cellValue ? cellValue.toString() : ""}</div>;
      }
    },
    [],
  );

  return (
    <>
      <Table
        aria-label="Main Table"
        isCompact
        removeWrapper
        classNames={{ th: "bg-transparent" }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={`${column.key === "products" ? "w-[600px]" : ""} ${
                column.key === "sub_total"
                  ? "w-[82px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                  : ""
              } ${
                column.key === "action"
                  ? "!w-[40px] !min-w-[40px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                  : ""
              } ${
                column.key === "quantity"
                  ? "w-[40px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                  : ""
              }`}
            >
              <div
                className={`${
                  column.key === "action"
                    ? "flex items-center justify-center"
                    : ""
                } ${
                  column.key === "quantity"
                    ? "flex items-center justify-center"
                    : ""
                } ${
                  column.key === "sub_total"
                    ? "flex items-center justify-center"
                    : ""
                } `}
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
                  className={`${
                    columnKey === "sub_total"
                      ? "w-[82px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                      : ""
                  } ${
                    columnKey === "action"
                      ? "!w-[40px] !min-w-[40px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                      : ""
                  } ${
                    columnKey === "quantity"
                      ? "w-[40px] px-0 sm:px-3 [&>div]:mx-auto [&>div]:w-min"
                      : ""
                  }`}
                >
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <Table>
        <TableHeader>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={`whitespace-nowrap text-xs ${col.style}`}
            >
              {col.label}
            </TableHead>
          ))}
        </TableHeader>
        <TableBody>
          {dataClient.map((item) => (
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  className={cn("font-medium", col.style)}
                  key={col.key}
                >
                  {renderCell(item, col.key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </>
  );
};

export default TableForm;
