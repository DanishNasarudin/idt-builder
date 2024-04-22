import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { AdminBodyProductType } from "./AdminBodyShcn";

type Props = {};

const SortableItem = ({
  item,
  renderCell,
  columns,
  selectColumn,
  ...props
}: {
  item: AdminBodyProductType[0];
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.sort_val });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const checkSortAvailable = columns.find(
    (item) => item.key === "select",
  )?.visible;

  const conditionalProps = checkSortAvailable
    ? { ...attributes, ...listeners }
    : {};

  // const isSelected = selectedKeys.has(item.id);

  return (
    <React.Fragment key={item.sort_val}>
      <TableRow
        {...props}
        key={item.sort_val}
        ref={setNodeRef}
        style={style}
        {...conditionalProps}
        onClick={selectColumn ? undefined : () => console.log("")}
        className={cn(
          selectColumn && "bg-zinc-950",
          item.is_label && "bg-zinc-900",
          selectColumn && item.is_label && "bg-zinc-900",
          // "w-full",
        )}
      >
        {columns
          .filter((item) => item.visible)
          .map((col) => (
            <TableCell className={cn("font-medium", col.style)} key={col.key}>
              {renderCell(item, col.key, selectColumn)}
            </TableCell>
          ))}
      </TableRow>
    </React.Fragment>
  );
};

export default SortableItem;
