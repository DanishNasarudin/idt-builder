"use client";

import {
  adminInsertListing,
  adminUpdateListing,
} from "@/app/(serverActions)/adminActions";
import { deepCopy, sortProducts } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Pagination,
  Select,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AdminBodyProductType, AdminBodyType } from "./AdminBodyShcn";
import AdminDeletePop from "./AdminDeletePop";
import AdminSortValField from "./AdminSortValField";

type Props = {
  content: AdminBodyType;
};

// export type AdminBodyType = {
//   id: number;
//   product: AdminBodyProductType;
// };

// export type AdminBodyProductType = {
//   id: number;
//   sort_val: number;
//   product_name: string | null;
//   ori_price: number | null;
//   dis_price: number | null;
//   is_available: boolean | null;
//   is_label: boolean | null;
//   is_soldout: boolean;
// }[];

type Selection = "all" | Set<React.Key>;

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
  {
    key: "sorting",
    label: "SORT",
    visible: true,
  },
  {
    key: "product_name",
    label: "PRODUCTS",
    visible: true,
  },
  {
    key: "ori_price",
    label: "ORI PRICE",
    visible: true,
  },
  {
    key: "dis_price",
    label: "SALE PRICE",
    visible: true,
  },
  {
    key: "is_sale",
    label: "SALE?",
    visible: true,
  },
  {
    key: "is_label",
    label: "LABEL",
    visible: true,
  },
  {
    key: "is_available",
    label: "ACTIVE",
    visible: true,
  },
  {
    key: "actions",
    label: "ACTIONS",
    visible: true,
  },
];

function findUpdatedItems(
  originalItems: AdminBodyProductType,
  currentItems: AdminBodyProductType,
) {
  const updatedItems = currentItems.filter((currentItem) => {
    const originalItem = originalItems.find(
      (oItem) => oItem?.id === currentItem?.id,
    );

    // If an item with the same ID is not found, it's a new item (or handle accordingly)
    if (!originalItem) return true;

    return (
      originalItem.dis_price !== currentItem?.dis_price ||
      originalItem.is_available !== currentItem?.is_available ||
      originalItem.is_label !== currentItem?.is_label ||
      originalItem.ori_price !== currentItem?.ori_price ||
      originalItem.product_name !== currentItem?.product_name ||
      originalItem.sort_val !== currentItem?.sort_val
    );
  });

  return updatedItems;
}

const AdminBody = ({ content }: Props) => {
  //   console.log(content.product);

  const [data, setData] = React.useState(deepCopy(content.product));

  //   console.log(data[5]);

  React.useEffect(() => {
    const sortedAndResolved = sortProducts(content.product);
    setData(sortedAndResolved);
    // setData(deepCopy(content.product));
  }, [content]);

  // Handle Pages -------------------------------------------------------------
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(30);
  //   const rowsPerPage = 30;
  const pages = Math.ceil(data.length / rowsPerPage);

  const finalListRender = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [data, pages, page]);

  // Handle Drags ---------------------------------------------------------------
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set<React.Key>(),
  );

  const handleSelectionChange = (newSelectedKeys: Selection) => {
    if (newSelectedKeys === "all") {
      console.log("All items are selected. Handle accordingly.");
      // Perform any additional logic required when all items are selected.
      setSelectedKeys("all");
    } else {
      setSelectedKeys(newSelectedKeys); // Directly use the Set<React.Key> without conversion
    }
  };

  const [dragOverIdx, setDragOverIdx] = React.useState<number | null>(null);
  const dragItems = React.useRef<Set<number>>(new Set());
  const draggedOverItem = React.useRef<number | null>(null);

  // console.log(selectedKeys, dragItems, draggedOverItem);

  const onDragStart = () => {
    if (selectedKeys === "all") {
      // Handle the 'all' case if applicable to your scenario
    } else {
      // Convert set of React.Key to indices
      const indices = new Set<number>();
      selectedKeys.forEach((key) => {
        // console.log(key);
        const index = finalListRender.findIndex(
          (item) => String(item.sort_val) === key,
        );
        // console.log(index);
        if (index !== -1) indices.add(index);
      });
      dragItems.current = indices;
    }
  };

  //   console.log("dragbody", dragItem.current, draggedOverItem.current);

  const handleSort = () => {
    setData((prev) => {
      let newItems = [...prev];
      const overIndex = draggedOverItem.current;

      if (typeof overIndex === "number") {
        const itemsBeingDragged = Array.from(dragItems.current)
          .sort()
          .map((index) => newItems[index]);
        const filteredItems = newItems.filter(
          (_, index) => !dragItems.current.has(index),
        );

        // Inserting items at the position
        newItems = [
          ...filteredItems.slice(0, overIndex),
          ...itemsBeingDragged,
          ...filteredItems.slice(overIndex),
        ];

        // Reset the order values
        newItems = newItems.map((item, idx) => ({
          ...item,
          sort_val: idx,
        }));
      }

      return newItems;
    });

    setDragOverIdx(null);
    dragItems.current.clear();
    draggedOverItem.current = null;
  };

  const handleSortOver = (e: React.DragEvent, overIdx: number) => {
    e.preventDefault();

    const isOverDifferentItem =
      dragItems.current.size === 0 || !dragItems.current.has(overIdx);

    if (isOverDifferentItem) {
      setDragOverIdx(overIdx);
    } else {
      setDragOverIdx(null);
    }
  };

  // Handle save to db ---------------------------------------------------------

  const debHandleUpdateDB = () => {
    const findItem = findUpdatedItems(content.product, data);
    toast.promise(adminUpdateListing(findItem), {
      loading: "Updating...",
      success: "Updated!",
      error: (data) => `Error: ${data}`,
    });
  };

  //   const handleUpdateDB = React.useCallback(
  //     debounceFunc(debHandleUpdateDB, 5000),
  //     []
  //   );
  //   React.useEffect(() => {
  //     handleUpdateDB();
  //   }, [data, handleUpdateDB]);

  // Custom Cells -----------------------------------------------------------------
  const renderCell = React.useCallback(
    (item: AdminBodyProductType[0], columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof AdminBodyProductType[0]];

      switch (columnKey) {
        case "sorting":
          return (
            <>
              <AdminSortValField item={item} setData={setData} />
            </>
          );
        case "product_name":
          return (
            <>
              <Textarea
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
                isDisabled={item.is_label === true}
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
                isDisabled={item.dis_price === null}
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
        case "is_available":
          return (
            <>
              {/* {`${item.is_available}`} */}
              <Switch
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
            <div className="relative flex items-center gap-4">
              <AdminDeletePop item={item} setData={setData} data={data} />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

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

  return (
    <div>
      <Table
        aria-label="Table Content"
        // selectedKeys={selectedKeys}
        // selectionMode="multiple"
        // onSelectionChange={handleSelectionChange}
        // selectionBehavior="toggle"
        // allowDuplicateSelectionEvents={false}
        removeWrapper
        isCompact
        topContent={
          <div className="flex gap-2">
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
          </div>
        }
        bottomContent={
          <div className="mx-auto flex gap-4">
            <Select
              items={[
                { key: 30, name: "30" },
                { key: 60, name: "60" },
                { key: 120, name: "120" },
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
                  keyArray.length > 0 ? (keyArray[0] as number) : 30,
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
        }
        classNames={{ td: "px-1 justify-center text-center" }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              className={`${column.key === "product_name" ? "w-full" : ""} ${
                column.key !== "product_name" ? "text-center" : ""
              }`}
              key={column.key}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {finalListRender.map((item) => (
            <TableRow
              key={item.sort_val}
              draggable
              onDragStart={() => onDragStart()}
              onDragEnter={() =>
                (draggedOverItem.current = Number(
                  data.findIndex((idx) => idx?.sort_val === item?.sort_val),
                ))
              }
              onDragEnd={handleSort}
              onDragOver={(e) =>
                handleSortOver(
                  e,
                  data.findIndex((idx) => idx?.sort_val === item?.sort_val),
                )
              }
              className={`
                            ${
                              dragOverIdx ===
                              data.findIndex(
                                (idx) => idx?.sort_val === item?.sort_val,
                              )
                                ? "bg-zinc-500"
                                : "mobilehover:hover:bg-zinc-800"
                            } cursor-grab transition-all
                          `}
            >
              {(columnKey) => (
                <TableCell
                  className={`${
                    columnKey !== "product_name"
                      ? "[&>div]:mx-auto [&>div]:w-min"
                      : ""
                  } border-y-[1px] border-zinc-800`}
                >
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminBody;
