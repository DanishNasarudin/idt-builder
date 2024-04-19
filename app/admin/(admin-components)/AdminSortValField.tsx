import { Input } from "@nextui-org/react";
import React from "react";
import { AdminBodyProductType } from "./AdminBodyShcn";

const AdminSortValField = ({
  item,
  setData,
  isDisabled,
}: {
  item: AdminBodyProductType[0];
  setData: (value: React.SetStateAction<AdminBodyProductType>) => void;
  isDisabled?: boolean;
}) => {
  const [sortValString, setSortValString] = React.useState("");

  const initSortVal = React.useRef<number | null>(null);
  const toSortVal = React.useRef<number | null>(null);
  React.useEffect(() => {
    setSortValString(item.sort_val !== null ? String(item.sort_val) : "null");
    if (initSortVal.current === null) {
      initSortVal.current = item.sort_val !== null ? item.sort_val : null;
    }
  }, [item]);
  return (
    <>
      <Input
        isDisabled={isDisabled}
        classNames={{
          inputWrapper: "bg-transparent min-h-min h-min p-1",
          innerWrapper: "min-w-[40px] w-min h-min",
          input: "text-xs text-center",
        }}
        radius="sm"
        // minRows={1}
        className=""
        value={sortValString}
        onValueChange={(e) => {
          setSortValString(e);
          toSortVal.current = Number(e);
        }}
        onFocusChange={(e) => {
          if (!e) {
            setData((prev) => {
              let newItems = [...prev];

              const dragIndex = initSortVal.current;
              const overIndex = toSortVal.current;

              // Ensure both indexes are valid before proceeding
              if (
                typeof dragIndex === "number" &&
                typeof overIndex === "number"
              ) {
                const itemBeingDragged = newItems[dragIndex - 1];

                // Rearrange the items based on the drag-and-drop operation
                newItems.splice(dragIndex - 1, 1);
                newItems.splice(overIndex - 1, 0, itemBeingDragged);

                // console.log(itemBeingDragged);
                // Update the temporary 'id' or any other property as needed
                newItems = newItems.map((item, idx) => ({
                  ...item,
                  sort_val: idx + 1,
                }));
              }

              return newItems;
            });
            initSortVal.current = null;
            toSortVal.current = null;
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setData((prev) => {
              let newItems = [...prev];

              const dragIndex = initSortVal.current;
              const overIndex = toSortVal.current;

              // Ensure both indexes are valid before proceeding
              if (
                typeof dragIndex === "number" &&
                typeof overIndex === "number"
              ) {
                const itemBeingDragged = newItems[dragIndex - 1];

                // Rearrange the items based on the drag-and-drop operation
                newItems.splice(dragIndex - 1, 1);
                newItems.splice(overIndex - 1, 0, itemBeingDragged);

                // console.log(itemBeingDragged);
                // Update the temporary 'id' or any other property as needed
                newItems = newItems.map((item, idx) => ({
                  ...item,
                  sort_val: idx + 1,
                }));
              }

              return newItems;
            });
            initSortVal.current = null;
            toSortVal.current = null;
          }
        }}
      />
    </>
  );
};

export default AdminSortValField;
