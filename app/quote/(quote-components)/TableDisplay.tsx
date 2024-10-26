"use client";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { DisplayFormData } from "../[id]/page";

type Props = {
  data: DisplayFormData[];
};

const columns = [
  { key: "name", label: "Product Name" },
  { key: "total", label: "Price" },
  { key: "qty", label: "Qty" },
  { key: "price", label: "Total" },
];

const TableDisplay = ({ data }: Props) => {
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
              className={cn(
                column.key === "qty" ? "px-1 text-center" : "",
                column.key === "total" ? "px-1 text-center" : "",
                column.key === "price" ? "px-1 text-center" : "",
                column.key === "name" ? "min-w-[50px]" : ""
              )}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell
                  className={cn(
                    "text-[10px] sm:text-sm text-center",
                    (columnKey as keyof DisplayFormData) === "name" &&
                      "text-left"
                  )}
                >
                  {getKeyValue(item, columnKey as keyof DisplayFormData)}
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
