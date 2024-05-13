import { MinusIcon } from "@/app/(main-components)/Icons";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { containsSearchTerm, deepCopy, sortProducts } from "@/lib/utils";
import { useAdminStore, useAdminStoreChangeData } from "@/lib/zus-store";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Checkbox,
  cn,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React from "react";
import { TableVirtuoso } from "react-virtuoso";
import { AdminBodyProductType } from "./AdminBodyShcn";
import AdminBodyTableRow from "./AdminBodyTableRow";
import SortableItem from "./SortableItem";

import { useShallow } from "zustand/react/shallow";

type Props = {
  dataInit: AdminBodyProductType;
  searchVal: string;
  setSearchVal: React.Dispatch<React.SetStateAction<string>>;
};

const AdminBodyTable = ({ dataInit, searchVal, setSearchVal }: Props) => {
  const {
    selectColumn,
    selectedKeys,
    setSelectedKeys,
    rowsPerPage,
    setRowsPerPage,
  } = useAdminStore();

  const initChangeData = useAdminStoreChangeData(
    useShallow((state) => state.initChangeData),
  );

  const [data, setData] = React.useState(deepCopy(dataInit));

  // const initSelectColumn = React.useRef(selectColumn);

  React.useEffect(() => {
    // console.log("pass");
    const sortedAndResolved = sortProducts(dataInit);
    setData(sortedAndResolved);
    // initChangeData(sortedAndResolved);
  }, [dataInit]);

  // const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
  //   new Set<React.Key>(),
  // );

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

    // document.body.style.overflowY = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const onValueChangeSelect = React.useCallback(
    (e: boolean, id: number) => {
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
    },
    [lastSelectedIndex],
  );

  // Table data management --------------------------------------------------

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

  const [page, setPage] = React.useState(1);

  // const [rowsPerPage, setRowsPerPage] = React.useState<number | "Max">(
  //   selectColumn ? 30 : "Max",
  // );

  const [resetSearch, setResetSearch] = React.useState(false);

  React.useEffect(() => {
    selectColumn ? setRowsPerPage(30) : setRowsPerPage("Max");
  }, [selectColumn]);
  //   const rowsPerPage = 30;
  // let pages: number = 0;
  const pages = React.useMemo(() => {
    if (rowsPerPage === "Max") return page;
    return Math.ceil(data.length / rowsPerPage);
  }, [data.length, rowsPerPage]);

  const finalListRender = React.useMemo(() => {
    const sortedFilteredData = data
      .sort((a, b) => a.sort_val - b.sort_val)
      .filter((fil) => !fil.hidden);

    // If rowsPerPage is set to "Max", return the full data set
    if (rowsPerPage === "Max") {
      if (searchVal) {
        const slicePerSearch = data.findIndex((item) =>
          containsSearchTerm(item, searchVal),
        );
        return sortedFilteredData.slice(slicePerSearch, data.length) || {};
      }
      return sortedFilteredData || {};
    }

    // Calculate pagination based on rowsPerPage not being "Max"
    // pages = Math.ceil(data.length / rowsPerPage);
    let effectiveSearchVal = resetSearch ? "" : searchVal;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (effectiveSearchVal) {
      // console.log("Pass", searchVal, searchDeTrigger.current);
      const slicePerSearch = data.findIndex((item) =>
        containsSearchTerm(item, searchVal),
      );
      if (slicePerSearch !== -1) {
        const newPage = Math.ceil((slicePerSearch + 1) / rowsPerPage);
        setPage(newPage);
      }
      return sortedFilteredData.slice(start, end) || {};
    }

    return sortedFilteredData.slice(start, end) || {};
    // The dependencies now accurately reflect what finalListRender relies on
  }, [
    data,
    rowsPerPage,
    page,
    selectColumn,
    selectedKeys,
    searchVal,
    resetSearch,
  ]);

  React.useEffect(() => {
    if (resetSearch) {
      setSearchVal("");
      setResetSearch(false); // Reset the flag after clearing the search input
    }
  }, [resetSearch]);

  //   console.log(rowsPerPage, finalListRender.length, "CHECK");

  const sortProps = React.useMemo(
    () => finalListRender.map((item) => item.sort_val),
    [finalListRender],
  );

  // const generateRow = React.useCallback(() => {
  //   return finalListRender.map((item) => (
  //     <SortableItem
  //       key={item.sort_val}
  //       item={item}
  //       data={data}
  //       setData={setData}
  //       selectedKeys={selectedKeys}
  //       onValueChangeSelect={onValueChangeSelect}
  //       columns={columns}
  //       selectColumn={selectColumn}
  //     />
  //   ));
  // }, [finalListRender]);

  // Dragging mechanics ------------------------------------------------------------

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

    const modifiedResult = (prev: AdminBodyProductType) => {
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
    };

    setData((prev) => {
      return modifiedResult(prev);
    });
    initChangeData(modifiedResult(data));
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

  return (
    <>
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
          {!selectColumn ? (
            <>
              <ResizablePanelGroup
                direction="vertical"
                className="mt-4 min-h-[100vh] w-full"
              >
                <ResizablePanel defaultSize={60}>
                  <TableVirtuoso
                    overscan={10}
                    style={{ height: "100%", width: "100%" }}
                    // useWindowScroll
                    className=""
                    data={finalListRender}
                    components={{
                      Table: (props) => <Table {...props} />,
                      TableHead: React.forwardRef(
                        function TableHeadComponent(props, ref) {
                          return (
                            <TableHeader
                              ref={ref}
                              {...props}
                              className="table-row-group"
                            />
                          );
                        },
                      ),
                      TableBody: React.forwardRef(
                        function TableBodyComponent(props, ref) {
                          return <TableBody ref={ref} {...props} />;
                        },
                      ),
                      TableRow: (props) => {
                        const index = props["data-index"];
                        const style = props["style"];
                        const item = finalListRender[index];
                        return (
                          <SortableItem
                            {...props}
                            styleTop={style}
                            key={item.sort_val}
                            item={item}
                            data={data}
                            setData={setData}
                            selectedKeys={selectedKeys}
                            onValueChangeSelect={onValueChangeSelect}
                            columns={columns}
                            selectColumn={selectColumn}
                          />
                        );
                      },
                    }}
                    fixedHeaderContent={() => (
                      <TableRow className="sticky top-0 z-[50] bg-[rgb(20,20,20)]">
                        {columns
                          .filter((col) => col.visible)
                          .map((col) => (
                            <TableHead
                              key={col.key}
                              className={cn(
                                `whitespace-nowrap text-xs`,
                                col.style,
                              )}
                            >
                              {col.label}
                            </TableHead>
                          ))}
                      </TableRow>
                    )}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40}></ResizablePanel>
              </ResizablePanelGroup>
            </>
          ) : (
            <>
              <Table
                className="mt-4"
                // style={{ transform: `translateY(${startIndex}px)` }}
              >
                <TableHeader>
                  <TableRow className="sticky top-[72px] z-[20] bg-[rgb(20,20,20)]">
                    {columns
                      .filter((col) => col.visible)
                      .map((col) => (
                        <TableHead
                          key={col.key}
                          className={cn(
                            `whitespace-nowrap text-xs `,
                            col.style,
                          )}
                        >
                          {col.label}
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AdminBodyTableRow
                    finalListRender={finalListRender}
                    data={data}
                    setData={setData}
                    selectedKeys={selectedKeys}
                    onValueChangeSelect={onValueChangeSelect}
                    columns={columns}
                    selectColumn={selectColumn}
                  />
                </TableBody>
              </Table>
            </>
          )}
        </SortableContext>
      </DndContext>
      {selectColumn && (
        <div className="sticky bottom-4 mx-auto mt-4 flex justify-center gap-4">
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
            onChange={async (page) => {
              // searchDeTrigger.current = false;
              setPage(page);
              setResetSearch(true);
            }}
            radius="sm"
          />
        </div>
      )}
    </>
  );
};

export default React.memo(AdminBodyTable);
