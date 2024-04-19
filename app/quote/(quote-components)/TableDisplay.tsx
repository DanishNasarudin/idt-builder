"use client";

import { Products, useSelectStore } from "@/lib/zus-store";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";

type Props = {};

const rows = [
  {
    key: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
];

const columns = [
  { key: "product_name", label: "Product Name" },
  { key: "price", label: "Price" },
  { key: "qty", label: "Qty" },
  { key: "sub_total", label: "Total" },
];

const TableDisplay = (props: Props) => {
  const data = useSelectStore((state) => state.selectedData);

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
        <TableBody items={data.products} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item.product_name}>
              {(columnKey) => (
                <TableCell
                  className={`${
                    (columnKey as keyof Products) === "qty" && "text-center"
                  } ${
                    (columnKey as keyof Products) === "price" && "text-center"
                  } ${
                    (columnKey as keyof Products) === "sub_total" &&
                    "text-center"
                  }
                  ${(columnKey as keyof Products) === "product_name" && ""}
                  text-[10px] sm:text-sm
                  `}
                >
                  {getKeyValue(item, columnKey as keyof Products)}
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
