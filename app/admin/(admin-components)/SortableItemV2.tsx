import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, Row } from "@tanstack/react-table";
import React from "react";
import { AdminBodyProductType } from "./AdminBodyShcn";

type Props = {};

const SortableItem = ({
  selectColumn,
  renderCell,
  columns,
  ...props
}: {
  renderCell: (
    item: AdminBodyProductType[0],
    columnKey: React.Key,
    selectColumn: boolean,
  ) => string | number | boolean | JSX.Element | null | undefined;
  columns: (
    | {
        key: string;
        label: JSX.Element;
        visible: boolean;
        style: string;
      }
    | {
        key: string;
        label: string;
        visible: boolean;
        style: string;
      }
  )[];
  selectColumn: boolean;
  [key: string]: any;
}) => {
  const row: Row<{
    id: number;
    sort_val: number;
    product_name: string | null;
    ori_price: number | null;
    dis_price: number | null;
    is_available: boolean | null;
    is_label: boolean | null;
    is_soldout: boolean;
    hidden?: boolean;
  }> = props.item;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.getValue("sort_val") });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // const checkSortAvailable = columns.find(
  //   (item) => item.key === "select",
  // )?.visible;

  const conditionalProps = selectColumn ? { ...attributes, ...listeners } : {};

  // const isSelected = selectedKeys.has(item.id);
  const is_label = row.getValue("is_label");

  return (
    <React.Fragment key={row.getValue("sort_val")}>
      <TableRow
        {...props}
        key={row.getValue("sort_val")}
        ref={setNodeRef}
        style={style}
        {...conditionalProps}
        onClick={selectColumn ? undefined : () => console.log("")}
        className={cn(
          selectColumn && "bg-zinc-950",
          (row.getValue("is_label") as boolean) && "bg-zinc-900",
          selectColumn &&
            (row.getValue("is_label") as boolean) &&
            "bg-zinc-900",
          // "w-full",
        )}
      >
        {/* {row.getVisibleCells().map((cell) => {
          return (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })} */}
        {columns
          .filter((item) => item.visible)
          .map((col) => (
            <TableCell className={cn("font-medium", col.style)} key={col.key}>
              {renderCell(row.original, col.key, selectColumn)}
            </TableCell>
          ))}
      </TableRow>
    </React.Fragment>
  );
};

export default SortableItem;
