import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useAdminStoreChangeData } from "@/lib/zus-store";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox, Switch, Textarea } from "@nextui-org/react";
import React from "react";
import { AdminBodyProductType, Selection } from "./AdminBodyShcn";
import AdminDeletePop from "./AdminDeletePop";
import AdminSortValField from "./AdminSortValField";

type Props = {
  index?: number;
  styleTop?: React.CSSProperties | undefined;
  item: AdminBodyProductType[0];
  setData: React.Dispatch<React.SetStateAction<AdminBodyProductType>>;
  selectedKeys: Selection;
  data: AdminBodyProductType;
  onValueChangeSelect: (e: boolean, id: number) => void;
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
};

const SortableItem = ({
  index,
  styleTop,
  item,
  setData,
  selectedKeys,
  data,
  onValueChangeSelect,
  columns,
  selectColumn,
  ...props
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, node } =
    useSortable({ id: item.sort_val });

  // console.log(item);
  // const inViewRef = React.useRef<HTMLDivElement | null>(null);
  // const setInView = useAdminStore((state) => state.setInView);
  // const delInView = useAdminStore((state) => state.delInView);

  // const isVisible = useInView(node, { amount: "all" });
  // const isInViewDeb = useDebounce(isInView, 1000);
  // const [isVisible, setIsVisible] = React.useState(false);
  // const lastIsInView = React.useRef<boolean | null>(isVisible);

  // const isInViewDeb = useDebounce(isInView, 500);

  // console.log(isInViewStore);
  // console.log("pass");
  // React.useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       setIsVisible(entry.isIntersecting);
  //     },
  //     {
  //       root: null, // viewport
  //       rootMargin: "0px", // no margin
  //       threshold: 1, // 50% of target visible
  //     },
  //   );

  //   if (node.current) {
  //     observer.observe(node.current);
  //   }

  //   // Clean up the observer
  //   return () => {
  //     if (node.current) {
  //       observer.unobserve(node.current);
  //     }
  //   };
  // }, []);

  // const handleInViewChange = React.useCallback(
  //   (isVisible: boolean, id: number) => {
  //     if (isVisible) {
  //       setInView(id);
  //     } else {
  //       delInView(id);
  //     }
  //   },
  //   [],
  // );

  // React.useEffect(() => {
  //   // if (item.sort_val === 9) {
  //   //   // console.log(lastIsInView.current, isVisible, "Cjecl");
  //   // }
  //   if (lastIsInView.current !== isVisible) {
  //     handleInViewChange(isVisible, item.sort_val);
  //     lastIsInView.current = isVisible;
  //   }
  // }, [isVisible, item.id, handleInViewChange]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...styleTop,
  };

  const checkSortAvailable = columns.find(
    (item) => item.key === "select",
  )?.visible;

  const conditionalProps = checkSortAvailable
    ? { ...attributes, ...listeners }
    : {};

  const [rowData, setRowData] = React.useState(item);
  const prevRowData = React.useRef(item);

  React.useEffect(() => {
    if (item !== prevRowData.current) {
      setRowData(item);
    }
  }, [item]);

  const handleCellValChange = (
    id: number,
    col: string,
    val: string | number | boolean | null,
  ) => {
    setRowData((prev) => {
      return { ...prev, [col]: val };
    });
  };

  const listenChange = React.useCallback(
    (id: number, col: string, val: string | number | boolean | null) => {
      handleCellValChange(id, col, val);
    },
    [],
  );

  const { setChangeData, initChangeData } = useAdminStoreChangeData();

  // const handleCellValChangeSub = (
  //   id: number,
  //   col: string,
  //   val: string | number | boolean,
  // ) => {
  //   // setChangeData((prev) => {
  //   //   return prev.map((row) => {
  //   //     if (row.id === id) {
  //   //       return {
  //   //         ...row,
  //   //         [col]: val,
  //   //       };
  //   //     }
  //   //     return row;
  //   //   });
  //   // });
  // };

  // const isSelected = selectedKeys.has(item.id);
  const renderCell = React.useCallback(
    (
      item: AdminBodyProductType[0],
      columnKey: React.Key,
      selectColumn: boolean,
    ) => {
      const cellValue = item[columnKey as keyof AdminBodyProductType[0]];

      const selected = new Set(selectedKeys);

      // console.log("pass");

      switch (columnKey) {
        case "select":
          return (
            <>
              <Checkbox
                aria-label={`${item.sort_val}`}
                radius="sm"
                isSelected={
                  selected.has(item.sort_val) || selectedKeys === "all"
                }
                onValueChange={(e) => {
                  onValueChangeSelect(e, item.sort_val);
                }}
              />
            </>
          );
        case "sorting":
          return (
            <>
              <AdminSortValField
                isDisabled={selectColumn}
                item={item}
                setData={setData}
              />
            </>
          );
        case "product_name":
          return (
            <>
              <Textarea
                aria-label={`${item.sort_val}`}
                isDisabled={selectColumn}
                classNames={{
                  inputWrapper: "bg-transparent min-h-min p-1",
                  input: "text-xs",
                }}
                radius="sm"
                minRows={1}
                className=""
                value={item.product_name !== null ? item.product_name : ""}
                onValueChange={(e) =>
                  handleCellValChange(item.id, "product_name", e)
                }
                onFocusChange={(e) =>
                  !e &&
                  setChangeData(item.id, "product_name", item.product_name!)
                }
              />
            </>
          );
        case "ori_price":
          return (
            <>
              <Textarea
                aria-label={`${item.sort_val}`}
                classNames={{
                  inputWrapper: "bg-transparent min-h-min p-1",
                  innerWrapper: "min-w-[50px] w-min",
                  input: "text-xs text-center",
                }}
                radius="sm"
                minRows={1}
                className=""
                value={
                  item.ori_price !== null ? String(item.ori_price) : "null"
                }
                isDisabled={item.is_label === true || selectColumn}
                onValueChange={(e) => listenChange(item.id, "ori_price", e)}
                onFocusChange={(e) =>
                  !e &&
                  setChangeData(
                    item.id,
                    "ori_price",
                    item.ori_price === null
                      ? item.ori_price
                      : Number(item.ori_price),
                  )
                }
              />
            </>
          );
        case "dis_price":
          return (
            <>
              <Textarea
                aria-label={`${item.sort_val}`}
                classNames={{
                  inputWrapper: "bg-transparent min-h-min py-1",
                  innerWrapper: "min-w-[50px] w-min",
                  input: "text-xs text-center",
                }}
                radius="sm"
                minRows={1}
                className=""
                value={
                  item.dis_price !== null ? String(item.dis_price) : "null"
                }
                isDisabled={item.dis_price === null || selectColumn}
                onValueChange={(e) => listenChange(item.id, "dis_price", e)}
                onFocusChange={(e) =>
                  !e &&
                  setChangeData(
                    item.id,
                    "dis_price",
                    item.dis_price === null
                      ? item.dis_price
                      : Number(item.dis_price),
                  )
                }
              />
            </>
          );
        case "is_sale":
          return (
            <>
              <Switch
                aria-label={`${item.sort_val}`}
                isDisabled={selectColumn}
                size="sm"
                className="[&>span]:mr-0 [&>span]:data-[selected=true]:!bg-accent"
                classNames={{ thumb: "z-0" }}
                isSelected={item.dis_price !== null ? true : false}
                onValueChange={(e) => {
                  listenChange(item.id, "dis_price", e ? 0 : null);
                  setChangeData(item.id, "dis_price", e ? 0 : null);
                }}
              />
            </>
          );
        case "is_label":
          return (
            <>
              <Switch
                aria-label={`${item.sort_val}`}
                isDisabled={selectColumn}
                size="sm"
                className="[&>span]:mr-0 [&>span]:data-[selected=true]:!bg-accent"
                classNames={{ thumb: "z-0" }}
                isSelected={item.is_label !== null ? item.is_label : false}
                onValueChange={(e) => {
                  listenChange(item.id, "is_label", e);
                  setChangeData(item.id, "is_label", e);
                }}
              />
            </>
          );
        case "is_soldout":
          return (
            <>
              <Switch
                aria-label={`${item.sort_val}`}
                isDisabled={selectColumn}
                size="sm"
                className="items-center justify-center [&>span]:mr-0 [&>span]:data-[selected=true]:!bg-accent"
                classNames={{ thumb: "z-0" }}
                isSelected={item.is_soldout !== null ? item.is_soldout : false}
                onValueChange={(e) => {
                  listenChange(item.id, "is_soldout", e);
                  setChangeData(item.id, "is_soldout", e);
                }}
              />
            </>
          );
        case "is_available":
          return (
            <>
              <Switch
                aria-label={`${item.sort_val}`}
                isDisabled={selectColumn}
                size="sm"
                className="items-center justify-center  [&>span]:mr-0 [&>span]:data-[selected=true]:!bg-accent"
                classNames={{ thumb: "z-0" }}
                isSelected={
                  item.is_available !== null ? item.is_available : false
                }
                onValueChange={(e) => {
                  listenChange(item.id, "is_available", e);
                  setChangeData(item.id, "is_available", e);
                }}
              />
            </>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-4">
              <AdminDeletePop
                isDisabled={selectColumn}
                item={item}
                setData={setData}
                initChangeData={initChangeData}
                data={data}
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [selectedKeys, columns, data],
  );

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
          (item.is_label || rowData.is_label) && "bg-zinc-900",
          selectColumn && (item.is_label || rowData.is_label) && "bg-zinc-900",
          // "w-full",
        )}
        aria-labelledby={`${item.sort_val}`}
      >
        {columns
          .filter((item) => item.visible)
          .map((col) => (
            <TableCell className={cn("font-medium", col.style)} key={col.key}>
              {renderCell(rowData, col.key, selectColumn)}
            </TableCell>
          ))}
      </TableRow>
    </React.Fragment>
  );
};

export default React.memo(SortableItem);
