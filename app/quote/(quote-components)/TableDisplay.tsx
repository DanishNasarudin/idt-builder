"use client";
import { useUserSelected } from "@/app/lib/zus-store";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { FormDataItem } from "../[id]/page-new";

type Props = {};

const columns = [
  { key: "product_name", label: "Product Name" },
  { key: "price", label: "Price" },
  { key: "qty", label: "Qty" },
  { key: "sub_total", label: "Total" },
];

const TableDisplay = () => {
  const data = useUserSelected((state) => state.selected);

  // const data: QuoteData = {} as QuoteData;

  // const dataFlattened = data.formData.map((item) => item);

  console.log(data);
  // console.log(data, dataFlattened);

  // const [data, setData] = React.useState<SelectedStore>(selected());

  // console.log()

  // console.log(data.products, "quote check");

  return (
    <div className="w-full">
      <Table
        aria-label="Quote"
        removeWrapper
        className="[&>table]:min-w-[200px] "
        classNames={{
          th: "bg-transparent border-b sm:px-3 px-0",
          td: "sm:px-3 px-0 before:group-data-[odd=true]:bg-zinc-900  text-[11px] sm:text-sm",
        }}
        isStriped
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={`${column.key === "qty" ? "px-1 text-center" : ""} ${
                column.key === "price" ? "px-1 text-center" : ""
              } ${column.key === "sub_total" ? "px-1 text-center" : ""}
              ${column.key === "product_name" ? "min-w-[50px]" : ""}
              
              `}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data.formData} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item.selectedOption.name}>
              {(columnKey) => (
                <TableCell
                  className={`${
                    (columnKey as keyof FormDataItem) === "quantity" &&
                    "text-center"
                  } 
                  ${
                    (columnKey as keyof FormDataItem) === "quantity" &&
                    "text-center"
                  } ${
                    (columnKey as keyof FormDataItem) === "quantity" &&
                    "text-center"
                  }
                  ${(columnKey as keyof FormDataItem) === "quantity" && ""}
                  text-[10px] sm:text-sm
                  `}
                >
                  {getKeyValue(item, columnKey as keyof FormDataItem)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDisplay;
