"use client";

import { MinusIcon } from "@/app/(main-components)/Icons";
import {
  adminInsertListing,
  adminUpdateListing,
} from "@/app/(serverActions)/adminActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, deepCopy, sortProducts, useWindowResize } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Input,
  Pagination,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Virtuoso } from "react-virtuoso";
import { toast } from "sonner";
import { z } from "zod";
import AdminAddBulkPop from "./AdminAddBulkPop";
import AdminDeletePop from "./AdminDeletePop";
import AdminDeletePopBulk from "./AdminDeletePopBulk";
import AdminSortValField from "./AdminSortValField";

type Props = {
  content: AdminBodyType;
};

export type AdminBodyType = {
  id: number;
  product: AdminBodyProductType;
};

export type AdminBodyProductType = {
  id: number;
  sort_val: number;
  product_name: string | null;
  ori_price: number | null;
  dis_price: number | null;
  is_available: boolean | null;
  is_label: boolean | null;
  is_soldout: boolean;
  hidden?: boolean;
}[];

export type Selection = "all" | Set<React.Key>;

function findUpdatedItems(
  originalItems: AdminBodyProductType,
  currentItems: AdminBodyProductType,
) {
  const updatedItems = currentItems.filter((currentItem) => {
    const originalItem = originalItems.find(
      (oItem) => oItem?.id === currentItem?.id,
    );

    // If an item with the same ID is not found, it's a new item (or handle accordingly)
    if (!originalItem) return false;

    return (
      originalItem.dis_price !== currentItem?.dis_price ||
      originalItem.is_available !== currentItem?.is_available ||
      originalItem.is_label !== currentItem?.is_label ||
      originalItem.ori_price !== currentItem?.ori_price ||
      originalItem.product_name !== currentItem?.product_name ||
      originalItem.sort_val !== currentItem?.sort_val ||
      originalItem.is_soldout !== currentItem?.is_soldout
    );
  });

  return updatedItems;
}

const AdminBodyShcn = ({ content }: Props) => {
  const [data, setData] = React.useState(deepCopy(content.product));
  // console.log(data, "chcek1");
  // console.log(content.product, "check2");

  React.useEffect(() => {
    const sortedAndResolved = sortProducts(content.product);
    setData(sortedAndResolved);
  }, [content]);

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set<React.Key>(),
  );

  // Multi-select using Shift -----------------------------------------------

  const [lastSelectedIndex, setLastSelectedIndex] = React.useState<
    number | null
  >(null);
  const shiftPressed = React.useRef(false);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Shift") {
        e.preventDefault();
        shiftPressed.current = true;
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "Shift") {
        e.preventDefault();
        shiftPressed.current = false;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const onValueChangeSelect = (e: boolean, id: number) => {
    if (shiftPressed.current && lastSelectedIndex !== null) {
      const range = [lastSelectedIndex, id].sort((a, b) => a - b);
      const itemsToSelect = data
        .filter(
          (item) => item.sort_val >= range[0] && item.sort_val <= range[1],
        )
        .map((item) => item.sort_val);
      setSelectedKeys(new Set([...selectedKeys, ...itemsToSelect]));
      // setLastSelectedIndex(null);
    } else {
      setSelectedKeys((prev) => {
        if (prev === "all") {
          return new Set([id]);
        } else {
          const newSet = new Set(prev);
          if (newSet.has(id) && !e) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return newSet;
        }
      });
    }

    setLastSelectedIndex(id);
  };

  const [selectColumn, setSelectColumn] = React.useState(false);

  const columns = React.useMemo(() => {
    return [
      {
        key: "select",
        label: (
          <Checkbox
            icon={<MinusIcon />}
            disableAnimation
            radius="sm"
            isSelected={
              new Set(selectedKeys).size > 0 || selectedKeys === "all"
            }
            onValueChange={(e) =>
              e ? setSelectedKeys("all") : setSelectedKeys(new Set([]))
            }
          />
        ),
        visible: selectColumn,
        style: "text-center",
      },
      {
        key: "sorting",
        label: "SORT",
        visible: true,
        style: "text-center",
      },
      {
        key: "product_name",
        label: "PRODUCTS",
        visible: true,
        style: "w-full",
      },
      {
        key: "ori_price",
        label: "ORI PRICE",
        visible: true,
        style: "text-center",
      },
      {
        key: "dis_price",
        label: "SALE PRICE",
        visible: true,
        style: "text-center",
      },
      {
        key: "is_sale",
        label: "SALE?",
        visible: true,
        style: "text-center",
      },
      {
        key: "is_label",
        label: "LABEL",
        visible: true,
        style: "text-center",
      },
      {
        key: "is_soldout",
        label: "SOLD OUT",
        visible: true,
        style: "text-center",
      },
      {
        key: "is_available",
        label: "ACTIVE",
        visible: true,
        style: "text-center",
      },
      {
        key: "actions",
        label: "ACTIONS",
        visible: true,
        style: "text-center",
      },
    ];
  }, [selectColumn, selectedKeys]);

  // Custom Shad -----------------------------------------------

  const setSize = React.useCallback((index: number, size: number) => {
    listItemHeight.current = { ...listItemHeight.current, [index]: size };
    // listRef.current.resetAfterIndex(index);
  }, []);

  const listItemHeight = React.useRef<number[]>([]);

  // const getItemHeight = (index: number) => listItemHeight.current[index] || 32;
  const getItemHeight = React.useCallback(
    (index: number) => listItemHeight.current[index] || 32,
    [],
  );

  const listRef = React.useRef<any>(null);

  const [windowWidth] = useWindowResize();

  // console.log(listItemHeight.current);

  const itemHeight = 32;
  const windowHeight = 400;
  const overscan = 10;

  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);

  // const generateRows = () => {
  //   return finalListRender
  //     .slice(startIndex, renderedNodesCount)
  //     .map((item) => (
  //       <SortableItem
  //         key={item.sort_val}
  //         item={item}
  //         renderCell={renderCell}
  //         columns={columns}
  //         selectColumn={selectColumn}
  //       />
  //     ));
  // };

  // Handle Pages -------------------------------------------------------------

  const [renderDataAgain, setRenderDataAgain] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const [rowsPerPage, setRowsPerPage] = React.useState<number | "Max">(120);
  //   const rowsPerPage = 30;
  let pages: number = 0;
  const finalListRender = React.useMemo(() => {
    // If rowsPerPage is set to "Max", return the full data set
    if (rowsPerPage === "Max") {
      return data;
    }

    // Calculate pagination based on rowsPerPage not being "Max"
    pages = Math.ceil(data.length / rowsPerPage);
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data
      .slice(start, end)
      .filter((fil) => !fil.hidden)
      .sort((a, b) => a.sort_val - b.sort_val);

    // The dependencies now accurately reflect what finalListRender relies on
  }, [data, rowsPerPage, page, selectColumn, selectedKeys, startIndex]);

  let renderedNodesCount = Math.floor(windowHeight / itemHeight) + 2 * overscan;
  renderedNodesCount = Math.min(
    finalListRender.length - startIndex,
    renderedNodesCount,
  );

  // console.log(pages, "check");

  const renderCell = React.useCallback(
    (
      item: AdminBodyProductType[0],
      columnKey: React.Key,
      selectColumn: boolean,
    ) => {
      const cellValue = item[columnKey as keyof AdminBodyProductType[0]];

      const selected = new Set(selectedKeys);

      switch (columnKey) {
        case "select":
          return (
            <>
              <Checkbox
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
                  setData((prev) => {
                    return prev.map((row) => {
                      if (row.id === item.id) {
                        return {
                          ...row,
                          product_name: e,
                        };
                      }
                      return row;
                    });
                  })
                }
              />
            </>
          );
        case "ori_price":
          return (
            <>
              <Textarea
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
                onValueChange={(e) =>
                  setData((prev) => {
                    return prev.map((row) => {
                      if (row.id === item.id) {
                        return {
                          ...row,
                          ori_price: Number(e),
                        };
                      }
                      return row;
                    });
                  })
                }
              />
            </>
          );
        case "dis_price":
          return (
            <>
              <Textarea
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
                onValueChange={(e) =>
                  setData((prev) => {
                    return prev.map((row) => {
                      if (row.id === item.id) {
                        return {
                          ...row,
                          dis_price: Number(e),
                        };
                      }
                      return row;
                    });
                  })
                }
              />
            </>
          );
        case "is_sale":
          return (
            <>
              <Switch
                isDisabled={selectColumn}
                size="sm"
                className="[&>span]:mr-0 [&>span]:data-[selected=true]:!bg-accent"
                isSelected={item.dis_price !== null ? true : false}
                onValueChange={(e) =>
                  setData((prev) => {
                    return prev.map((row) => {
                      if (row.id === item.id) {
                        return {
                          ...row,
                          dis_price: e ? 0 : null,
                        };
                      }
                      return row;
                    });
                  })
                }
              />
            </>
          );
        case "is_label":
          return (
            <>
              <Switch
                isDisabled={selectColumn}
                size="sm"
                className="[&>span]:mr-0 [&>span]:data-[selected=true]:!bg-accent"
                isSelected={item.is_label !== null ? item.is_label : false}
                onValueChange={(e) =>
                  setData((prev) => {
                    return prev.map((row) => {
                      if (row.id === item.id) {
                        return {
                          ...row,
                          is_label: e,
                        };
                      }
                      return row;
                    });
                  })
                }
              />
            </>
          );
        case "is_soldout":
          return (
            <>
              <Switch
                isDisabled={selectColumn}
                size="sm"
                className="items-center justify-center [&>span]:mr-0 [&>span]:data-[selected=true]:!bg-accent"
                isSelected={item.is_soldout !== null ? item.is_soldout : false}
                onValueChange={(e) =>
                  setData((prev) => {
                    return prev.map((row) => {
                      if (row.id === item.id) {
                        return {
                          ...row,
                          is_soldout: e,
                        };
                      }
                      return row;
                    });
                  })
                }
              />
            </>
          );
        case "is_available":
          return (
            <>
              <Switch
                isDisabled={selectColumn}
                size="sm"
                className="items-center justify-center [&>span]:mr-0 [&>span]:data-[selected=true]:!bg-accent"
                isSelected={
                  item.is_available !== null ? item.is_available : false
                }
                onValueChange={(e) =>
                  setData((prev) => {
                    return prev.map((row) => {
                      if (row.id === item.id) {
                        return {
                          ...row,
                          is_available: e,
                        };
                      }
                      return row;
                    });
                  })
                }
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
                data={data}
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [
      selectedKeys,
      columns,
      data,
      setSize,
      listRef,
      getItemHeight,
      windowWidth,
      listItemHeight,
    ],
  );

  // DND variables ----------------------------------------------------------------

  const sortProps = React.useMemo(
    () => finalListRender.map((item) => item.sort_val),
    [finalListRender],
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  function moveItem(arr: AdminBodyProductType, from: number, to: number) {
    const item = arr[from];
    let newArr = [...arr];
    newArr.splice(from, 1);
    newArr.splice(to, 0, item);

    // Optionally adjust sort_val here if necessary

    return newArr;
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over?.id) {
      return setData((prev) =>
        prev.map((item) => ({ ...item, hidden: false })),
      );
    }

    setData((prev) => {
      const activeIndex = prev.findIndex((item) => item.sort_val === active.id);
      const overIndex = prev.findIndex((item) => item.sort_val === over.id);

      // Early exit if no indexes found
      if (activeIndex < 0 || overIndex < 0) return prev;

      const activeItem = prev[activeIndex];
      const isSelected =
        selectedKeys !== "all" && selectedKeys.has(activeItem.sort_val);

      // If the active item is not selected, perform a single item move
      if (!isSelected) {
        return moveItem(prev, activeIndex, overIndex);
      }

      // Extract selected items and non-selected items
      const selectedItems = prev.filter((item) =>
        selectedKeys.has(item.sort_val),
      );
      const nonSelectedItems = prev.filter(
        (item) => !selectedKeys.has(item.sort_val),
      );

      // Determine the direction of movement
      const moveUp = overIndex < activeIndex;

      // Find the correct index for the first selected item after moving
      let targetIndex = nonSelectedItems.findIndex(
        (item) => item.sort_val === over.id,
      );
      if (moveUp) {
        // When moving up, we want to place items before the target
      } else {
        // When moving down, place items after the target
        targetIndex += 1;
      }

      // Reinsert selected items at the new position
      const result = [
        ...nonSelectedItems.slice(0, targetIndex),
        ...selectedItems,
        ...nonSelectedItems.slice(targetIndex),
      ];

      let sortValMapping = new Map();

      const modifiedResult = result.map((item, index) => {
        const newSortVal = index + 1;
        sortValMapping.set(item.sort_val, newSortVal);
        return {
          ...item,
          sort_val: newSortVal,
          hidden: false,
        };
      });

      const updatedSelectedKeys = new Set(
        [...selectedKeys].map((key) => sortValMapping.get(key) || key),
      );

      setSelectedKeys(updatedSelectedKeys);

      return modifiedResult;
    });
  }

  function onDragStart(event: DragStartEvent) {
    // Logic to mark the item as being dragged and to handle multi-selected items

    const { active } = event;
    const isActiveSelected =
      selectedKeys !== "all" && selectedKeys.has(active.id);

    // console.log(isActiveSelected);

    if (!isActiveSelected) {
      // console.log("pass");
      // If the active item isn't selected, clear the selection and select this item
      setSelectedKeys(new Set([active.id]));
      setLastSelectedIndex(active.id as number);
    }

    setData((prev) =>
      prev.map((item) => {
        const checkSelect = new Set(selectedKeys);
        if (
          checkSelect.size > 1 &&
          checkSelect.has(item.sort_val) &&
          item.sort_val !== event.active.id
        ) {
          return { ...item, hidden: true };
        } else {
          return item;
        }
      }),
    );
  }

  const onDragOver = (event: DragOverEvent) => {
    // console.log("pass");
  };

  // Handle adding product --------------------------------------------------
  const schema = z.object({
    sort_val: z.string(),
    product_name: z.string(),
  });

  type ListAddFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ListAddFields>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<ListAddFields> = async (formData) => {
    toast.promise(
      adminInsertListing(
        BigInt(content.id),
        Number(formData.sort_val),
        formData.product_name,
      ).then((dataId: any) => {
        // console.log(dataId, "CHECK");

        const newProduct = {
          id: dataId,
          sort_val: Number(formData.sort_val),
          product_name: formData.product_name,
          ori_price: null,
          dis_price: null,
          is_available: true,
          is_label: false,
          is_soldout: false,
        };

        let updatedProducts = [...data, newProduct];

        const sortedProducts = sortProducts(updatedProducts);

        setData(sortedProducts);
        // console.log(sortedProducts);
        toast.promise(adminUpdateListing(sortedProducts), {
          loading: "Updating...",
          success: "Updated!",
          error: (data) => `Error: ${data}`,
        });
      }),
      {
        loading: "Adding...",
        success: "Added!",
        error: (data) => `Error: ${data}`,
      },
    );
  };

  // Custom Shad Table Components -------------------------------------------

  // const table = useReactTable({
  //   data,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   state: {
  //     pagination: {
  //       pageIndex: 0,
  //       pageSize: data.length,
  //     },
  //   },

  const [listToRender, setListToRender] = React.useState({
    start: 0,
    end: finalListRender.length,
  });

  // console.log(listToRender);
  // console.log(finalListRender);

  return (
    <div>
      {/* <DragSelection /> */}
      <div id="drag-table">
        <div className="sticky top-4 z-[20] flex gap-2 bg-[rgb(15,15,15)]">
          <CustCheckBox
            onValueChange={(e) => {
              setSelectColumn(e);
              setSelectedKeys(new Set([]));
            }}
          />
          {selectColumn ? (
            <>
              <AdminDeletePopBulk
                setData={setData}
                data={data}
                selectedKeys={selectedKeys}
                setSelectedKeys={setSelectedKeys}
                rowsPerPage={rowsPerPage}
              />
              <AdminAddBulkPop
                catId={content.id}
                setData={setData}
                data={data}
                selectedKeys={selectedKeys}
                setSelectedKeys={setSelectedKeys}
              />
              <Button
                radius="sm"
                isDisabled={
                  findUpdatedItems(content.product, data).length === 0
                }
                onClick={() => {
                  const update = findUpdatedItems(content.product, data);
                  // console.log(update);
                  toast.promise(adminUpdateListing(update), {
                    loading: "Updating...",
                    success: "Updated!",
                    error: (data) => `Error: ${data}`,
                  });
                }}
                className={`${
                  findUpdatedItems(content.product, data).length > 0
                    ? "bg-accent"
                    : ""
                }  h-[56px]`}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <form
                className="flex w-full gap-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Input
                  {...register("sort_val")}
                  classNames={{
                    inputWrapper: "",
                  }}
                  radius="sm"
                  variant="bordered"
                  label="Sort Value"
                  className="max-w-[180px]"
                />
                <Input
                  {...register("product_name")}
                  classNames={{
                    inputWrapper: "",
                  }}
                  radius="sm"
                  variant="bordered"
                  label="Product Name"
                />
                <Button
                  type="submit"
                  radius="sm"
                  className="h-[56px] px-[40px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </form>
              <Button
                radius="sm"
                isDisabled={
                  findUpdatedItems(content.product, data).length === 0
                }
                onClick={() => {
                  const update = findUpdatedItems(content.product, data);
                  // console.log(update);
                  toast.promise(adminUpdateListing(update), {
                    loading: "Updating...",
                    success: "Updated!",
                    error: (data) => `Error: ${data}`,
                  });
                }}
                className={`${
                  findUpdatedItems(content.product, data).length > 0
                    ? "bg-accent"
                    : ""
                }  h-[56px]`}
              >
                Save
              </Button>
            </>
          )}
        </div>
        {/* <div
          className="mt-4 w-full overflow-y-scroll"
          style={{ height: `${windowHeight}px` }}
          onScroll={(e) => {
            setScrollTop(e.currentTarget.scrollTop);
          }}
        >
          <div
            style={{
              height: `${finalListRender.length * itemHeight}px`,
            }}
            className=""
          >
            <div
              style={{
                transform: `translateY(${startIndex * itemHeight}px)`,
              }}
            > */}
        <Table>
          <TableHeader>
            <TableRow className="sticky top-[72px] z-[20] bg-[rgb(20,20,20)]">
              {columns
                .filter((col) => col.visible)
                .map((col) => (
                  <TableHead
                    key={col.key}
                    className={`whitespace-nowrap text-xs ${col.style}`}
                  >
                    {col.label}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody className=" w-full">
            {/* <AutoSizer>
                {({ height, width }) => ( */}
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              sensors={sensors}
            >
              <SortableContext
                items={sortProps}
                strategy={verticalListSortingStrategy}
              >
                {/* {finalListRender
                        .slice(startIndex, renderedNodesCount)
                        .map((item) => (
                          <SortableItem
                            key={item.sort_val}
                            item={item}
                            renderCell={renderCell}
                            columns={columns}
                            selectColumn={selectColumn}
                          />
                        ))} */}
                <Virtuoso
                  className="table-row-group !h-[500px]"
                  components={{
                    // Item: (props) => <TableRow {...props} />,
                    Item: ({ children, ...props }) => (
                      <div {...props} className="check">
                        {children}
                      </div>
                    ),
                    List: React.forwardRef(
                      ({ children, ...props }, listRef) => (
                        <div
                          {...props}
                          ref={listRef}
                          className="table-row-group"
                        >
                          {children}
                        </div>
                      ),
                    ),
                  }}
                  // style={{ width: "100%" }}
                  data={finalListRender}
                  itemContent={(index, item) => (
                    <SortableItem
                      key={item.sort_val}
                      item={item}
                      renderCell={renderCell}
                      columns={columns}
                      selectColumn={selectColumn}
                    />
                  )}
                />
                {/* {generateRows()} */}
                {/* <List
                          ref={listRef}
                          itemData={finalListRender}
                          height={height}
                          width={width}
                          itemCount={finalListRender.length}
                          itemSize={getItemHeight}
                        >
                          {({ index, style, data }) => {
                            const item = data[index];
                            console.log(style);
                            // setRenderDataAgain((prev) => !prev);
                            return (
                              <SortableItem
                                index={index}
                                key={item.sort_val}
                                item={item}
                                renderCell={renderCell}
                                columns={columns}
                                selectColumn={selectColumn}
                                sty={style}
                                setSize={setSize}
                                windowWidth={windowWidth}
                              />
                            );
                          }}
                        </List> */}
              </SortableContext>
            </DndContext>
            {/* )}
              </AutoSizer> */}
          </TableBody>
        </Table>
        {/* <TableVirtuoso
          className="h-full w-full"
          data={finalListRender}
          components={{
            Table: (props) => <Table {...props} />,
            TableHead: (props) => (
              <TableHeader {...props} className="bg-background" />
            ),
            TableBody: (props) => (
              <TableBody {...props}>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEnd}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  sensors={sensors}
                >
                  <SortableContext
                    items={sortProps}
                    strategy={verticalListSortingStrategy}
                  ></SortableContext>
                </DndContext>
              </TableBody>
            ),
          }}
          fixedHeaderContent={() => (
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          )}
          itemContent={(index, item) => <><SortableItem
            key={item.sort_val}
            item={item}
            renderCell={renderCell}
            columns={columns}
            selectColumn={selectColumn}
          /></>}
        /> */}
        {/* </div>
          </div>
        </div> */}
        {/* <TableSample /> */}
        <div className="mx-auto mt-4 flex justify-center gap-4">
          <Select
            items={[
              { key: 30, name: "30" },
              { key: 60, name: "60" },
              { key: 120, name: "120" },
              { key: 99999, name: "Max" },
            ]}
            defaultSelectedKeys={["30"]}
            classNames={{
              innerWrapper: "w-min [&>span]:w-min [&>span]:leading-none",
              listbox: "w-min",
              mainWrapper: "w-min min-w-[70px]",
              base: "w-min",
              trigger: "min-h-[36px] h-[36px]",
            }}
            radius="sm"
            className=""
            onSelectionChange={(e) => {
              const keyArray = Array.from(e as Set<React.Key>);
              setRowsPerPage(
                keyArray.length > 0
                  ? (keyArray[0] as number) > 9999
                    ? "Max"
                    : (keyArray[0] as number)
                  : 30,
              );
            }}
            aria-label="page"
          >
            {(item) => (
              <SelectItem key={item.key} aria-label={`${item.key}`}>
                {item.name}
              </SelectItem>
            )}
          </Select>
          <Pagination
            isCompact
            showControls
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
            radius="sm"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminBodyShcn;

const SortableItem = ({
  item,
  renderCell,
  columns,
  selectColumn,
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
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, node } =
    useSortable({ id: item.sort_val });

  const [rendered, setRendered] = React.useState(false);
  const [heightOri, setHeightOri] = React.useState<number | undefined>(
    undefined,
  );

  const rowRef = React.useRef<HTMLTableRowElement | null>(null);

  // React.useEffect(() => {
  //   if (rowRef.current) {
  //     const height = rowRef.current.getBoundingClientRect().height;
  //     setHeightOri(height);
  //     setSize(index, height);
  //   }
  // }, [rowRef, setSize, windowWidth, index]);

  // const height = React.useMemo(() => {
  //   if (typeof window !== "undefined" && node.current !== undefined) {
  //     // console.log(node.current?.getBoundingClientRect().height);
  //     if (node.current?.getBoundingClientRect().height !== undefined)
  //       setSize(index, node.current?.getBoundingClientRect().height);
  //     return node.current?.getBoundingClientRect().height;
  //   }
  // }, [sty, node.current, rendered]);

  // const { top } = sty;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // top,
    // heightOri,
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
        key={item.sort_val}
        ref={rowRef}
        style={style}
        {...conditionalProps}
        onClick={selectColumn ? undefined : () => console.log("")}
        className={cn(
          selectColumn && "bg-zinc-950",
          item.is_label && "bg-zinc-900",
          selectColumn && item.is_label && "bg-zinc-900",
          "w-full",
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

const CustCheckBox = ({
  onValueChange,
}: {
  onValueChange?: (isSelected: boolean) => void;
}) => {
  const [isSelected, setIsSelected] = React.useState(false);

  const latestOnValueChange = React.useRef(onValueChange);

  React.useEffect(() => {
    latestOnValueChange.current = onValueChange;
  }, [onValueChange]);

  React.useEffect(() => {
    if (latestOnValueChange.current) latestOnValueChange.current(isSelected);
  }, [isSelected]);

  return (
    <Button
      radius="sm"
      onClick={() => setIsSelected((prev) => !prev)}
      className={cn(isSelected && "bg-accent/50", "h-[56px]")}
    >
      Bulk
    </Button>
  );
};
