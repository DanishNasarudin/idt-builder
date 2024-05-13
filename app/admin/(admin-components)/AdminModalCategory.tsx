"use client";
import { DelIcon, EditIcon } from "@/app/(main-components)/Icons";
import {
  adminDelCategory,
  adminInsertCategory,
  adminUpdateCategory,
} from "@/app/(serverActions)/adminActions";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";

import { deepCopy } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { AdminCatProps } from "./AdminHead";

type Props = {
  category: AdminCatProps;
  modalCategory: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onOpenChange: () => void;
    isControlled: boolean;
    getButtonProps: (props?: any) => any;
    getDisclosureProps: (props?: any) => any;
  };
};

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "actions",
    label: "ACTION",
  },
];

function findUpdatedItems(
  originalItems: AdminCatProps,
  currentItems: AdminCatProps,
) {
  const updatedItems = currentItems.filter((currentItem) => {
    const originalItem = originalItems.find(
      (oItem) => oItem?.db_id === currentItem?.db_id,
    );

    // If an item with the same ID is not found, it's a new item (or handle accordingly)
    if (!originalItem) return true;

    // Check for any differences between the current item and its original version
    // This is a simple comparison and might need to be expanded based on your data structure
    return (
      originalItem.name !== currentItem?.name ||
      originalItem.link !== currentItem?.link ||
      originalItem.id !== currentItem?.id
    );
  });

  return updatedItems;
}

const AdminModalCategory = ({ category, modalCategory }: Props) => {
  //   const { isOpen, onOpen, onClose } = useDisclosure();

  const [editCatPop, setEditCatPop] = React.useState(false);
  const [addCat, setAddCat] = React.useState("");
  const router = useRouter();

  const newLink = React.useMemo(() => {
    let newCat = addCat;
    newCat = newCat.replace(/&/g, "n");
    newCat = newCat.replace(/[\(\),]/g, "");
    newCat = newCat.trim().replace(/\s+/g, "-");
    return newCat;
  }, [addCat]);

  const [items, setItems] = React.useState(deepCopy(category));
  const [itemsCopy, setItemsCopy] = React.useState(deepCopy(category));

  React.useEffect(() => {
    setItems(deepCopy(category));
  }, [category]);

  // console.log(items);

  type Items = typeof items;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const renderCell = React.useCallback(
    (item: Items[0], columnKey: React.Key, idx: number) => {
      const cellValue = item ? item[columnKey as keyof Items[0]] : "";

      let itemNameTemp = "";

      // console.log(itemsCopy[idx]);
      // if (JSON.stringify(items[idx]) !== JSON.stringify(itemsCopy[idx])) {
      //   // console.log(items[idx], itemsCopy[idx]);
      //   if (items[idx]?.db_id !== itemsCopy[idx]?.db_id) {
      //     itemNameTemp = String(itemsCopy[idx]?.name);
      //   }
      // }

      switch (columnKey) {
        case "name":
          return (
            <>
              {itemNameTemp === ""
                ? item?.name
                : `${item?.name} ${itemNameTemp}`}
            </>
          );
        case "actions":
          return (
            <div className="flex items-center gap-4">
              <Popover
                placement="left"
                backdrop="transparent"
                containerPadding={0}
                radius="sm"
              >
                <Tooltip
                  content="Edit"
                  size="sm"
                  closeDelay={200}
                  placement="left"
                >
                  <div>
                    <PopoverTrigger>
                      <Button
                        className=" flex h-[24px]
                    w-[24px] min-w-[24px] items-center justify-center rounded-md bg-transparent transition-all mobilehover:hover:bg-zinc-700"
                        startContent={<EditIcon size={16} />}
                        isIconOnly
                        onClick={() => {
                          if (inputRef.current) {
                            // console.log("pass");
                            inputRef.current.focus();
                          }
                        }}
                      />
                    </PopoverTrigger>
                  </div>
                </Tooltip>
                <PopoverContent>
                  <Input
                    ref={inputRef}
                    defaultValue={item?.name !== null ? item?.name : ""}
                    onValueChange={(e) => {
                      setItems((prev) => {
                        const definedItems = prev.filter(
                          (item) => item !== undefined,
                        );
                        const row = definedItems.findIndex(
                          (idx) => idx?.id === item?.id,
                        );

                        if (row >= 0) {
                          definedItems[row]!.name = e;
                          return definedItems;
                        }
                        return prev;
                      });
                    }}
                  />
                </PopoverContent>
              </Popover>
              <div className="hidden max-h-[40px] flex-col">
                <Button
                  variant="bordered"
                  size="sm"
                  className="min-w-[40px] rounded-lg border-[1px] p-1"
                  onClick={() => {
                    setItems((prev) => {
                      const definedItems = prev.filter(
                        (
                          item,
                        ): item is {
                          name?: string;
                          link?: string;
                          id: number;
                          db_id?: number;
                        } => item !== undefined,
                      );

                      const index = definedItems.findIndex(
                        (idx) => idx?.id === item?.id,
                      );

                      if (index > 0) {
                        const newItems = [...definedItems];

                        const temp = newItems[index].id;
                        newItems[index].id = newItems[index - 1].id;
                        newItems[index - 1].id = temp;

                        return newItems.sort((a, b) => a.id - b.id);
                      }
                      return prev;
                    });
                  }}
                >
                  <div className="rotate-90">{`<`}</div>
                </Button>
                <Button
                  variant="bordered"
                  size="sm"
                  className="min-w-[40px] rounded-lg border-[1px] p-1"
                  onClick={() => {
                    setItems((prev) => {
                      const definedItems = prev.filter(
                        (
                          item,
                        ): item is {
                          name?: string;
                          link?: string;
                          id: number;
                          db_id?: number;
                        } => item !== undefined,
                      );

                      const index = definedItems.findIndex(
                        (idx) => idx.id === item?.id,
                      );

                      if (index >= 0 && index < prev.length - 1) {
                        const newItems = [...definedItems];

                        const temp = newItems[index].id;
                        newItems[index].id = newItems[index + 1].id;
                        newItems[index + 1].id = temp;

                        return newItems.sort((a, b) => a.id - b.id);
                      }
                      return prev;
                    });
                  }}
                >
                  <div className="rotate-90">{`>`}</div>
                </Button>
              </div>
              <Popover
                placement="left"
                backdrop="transparent"
                containerPadding={0}
                radius="sm"
              >
                <Tooltip
                  content="Delete"
                  size="sm"
                  closeDelay={200}
                  color="danger"
                  placement="right"
                >
                  <div>
                    <PopoverTrigger>
                      <Button
                        color="danger"
                        className=" flex h-[24px]
                    w-[24px] min-w-[24px] items-center justify-center rounded-md bg-transparent text-danger transition-all mobilehover:hover:bg-zinc-700"
                        startContent={<DelIcon size={16} />}
                        isIconOnly
                      />
                    </PopoverTrigger>
                  </div>
                </Tooltip>
                <PopoverContent>
                  <div className="flex gap-2">
                    Confirm ?
                    <Button
                      className=" flex
                    h-[24px] items-center justify-center rounded-md bg-danger transition-all"
                      onClick={() => {
                        // console.log(item?.db_id);
                        if (item?.db_id === undefined) return;
                        toast.promise(
                          adminDelCategory(item?.db_id).then(() => {
                            setItems((prev) =>
                              prev.filter((p) => p?.db_id !== item?.db_id),
                            );
                            router.push("/admin");
                          }),
                          {
                            loading: "Deleting...",
                            success: "Deleted!",
                            error: (data) => `Error: ${data}`,
                          },
                        );
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  const dragItem = React.useRef<number | null>(null);
  const draggedOverItem = React.useRef<number | null>(null);

  // console.log("dragmodal", dragItem.current, draggedOverItem.current);

  const handleSort = () => {
    setItems((prev) => {
      const definedItems = prev.filter((item) => item !== undefined);

      let newItems = [...definedItems];

      const dragIndex = dragItem.current;
      const overIndex = draggedOverItem.current;

      // Ensure both indexes are valid before proceeding
      if (typeof dragIndex === "number" && typeof overIndex === "number") {
        const itemBeingDragged = newItems[dragIndex];

        // Rearrange the items based on the drag-and-drop operation
        newItems.splice(dragIndex, 1);
        newItems.splice(overIndex, 0, itemBeingDragged);

        // Update the temporary 'id' or any other property as needed
        newItems = newItems.map((item, idx) => ({ ...item, id: idx }));
      }

      return newItems;
    });
    setDragOverIdx(null);
    dragItem.current = null;
    draggedOverItem.current = null;
  };

  const [dragOverIdx, setDragOverIdx] = React.useState<number | null>(null);
  const handleSortOver = (e: React.DragEvent, overIdx: number) => {
    e.preventDefault();

    if (dragItem.current !== overIdx) {
      setDragOverIdx(overIdx);
    } else {
      setDragOverIdx(null);
    }
  };

  return (
    <Modal
      isOpen={modalCategory.isOpen}
      onClose={modalCategory.onClose}
      size="lg"
      radius="sm"
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Edit Category</ModalHeader>
            <ModalBody>
              <div className="flex gap-3">
                <Input radius="sm" onValueChange={setAddCat} />
                <Button
                  radius="sm"
                  className="px-[32px]"
                  onClick={() => {
                    // setItems((prev) => [
                    //   ...prev,
                    //   {
                    //     id: prev.length + 1,
                    //     link: newLink,
                    //     name: addCat,
                    //   },
                    // ]);
                    toast.promise(
                      adminInsertCategory(addCat, items.length + 1),
                      {
                        loading: "Adding...",
                        success: "Added!",
                        error: (data) => `Error: ${data}`,
                      },
                    );
                  }}
                >
                  Add Category
                </Button>
              </div>
              <Table
                aria-label="categories"
                removeWrapper
                isCompact
                isHeaderSticky
                classNames={{
                  base: "max-h-[500px] overflow-y-scroll",
                }}
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={items} className="">
                  {items.map((item) => (
                    <TableRow
                      key={item?.id}
                      draggable
                      onDragStart={() =>
                        (dragItem.current = Number(
                          items.findIndex((idx) => idx?.id === item?.id),
                        ))
                      }
                      onDragEnter={() =>
                        (draggedOverItem.current = Number(
                          items.findIndex((idx) => idx?.id === item?.id),
                        ))
                      }
                      onDragEnd={handleSort}
                      onDragOver={(e) =>
                        handleSortOver(
                          e,
                          items.findIndex((idx) => idx?.id === item?.id),
                        )
                      }
                      className={`
                        ${
                          dragOverIdx ===
                          items.findIndex((idx) => idx?.id === item?.id)
                            ? "bg-zinc-500"
                            : "mobilehover:hover:bg-zinc-800"
                        } cursor-grab transition-all
                      `}
                    >
                      {(columnKey) => (
                        <TableCell>
                          {renderCell(
                            item,
                            columnKey,
                            items.findIndex((idx) => idx?.id === item?.id),
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onClick={modalCategory.onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const updatedItems = findUpdatedItems(category, items);
                  // console.log(category, items, updatedItems);
                  toast.promise(adminUpdateCategory(updatedItems), {
                    loading: "Updating...",
                    success: "Updated!",
                    error: (data) => `Error: ${data}`,
                  });
                  modalCategory.onClose();
                }}
              >
                Done
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AdminModalCategory;
