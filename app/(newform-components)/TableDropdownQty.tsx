"use client";
import { useUserSelected } from "@/lib/zus-store";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React from "react";

type Props = {
  category_id: number;
  product_id: number;
};

const TableDropdownQty = ({ category_id, product_id }: Props) => {
  const [selectedKeys, setSelectedKeys] = React.useState("1");

  const dataClient = useUserSelected((state) => state.dynamicData);
  const setDataClient = useUserSelected((state) => state.setData);
  const updateSelected = useUserSelected((state) => state.updateSelected);

  React.useEffect(() => {
    setSelectedKeys(() => {
      const check = dataClient
        .filter((data) => data.category_id === category_id)
        .map((prod) => prod.qty);
      return check[0] ? String(check[0]) : "0";
    });
  }, [dataClient]);

  return (
    <Dropdown
      placement="bottom"
      className="w-min min-w-0 bg-zinc-300 text-black"
      aria-label="number"
    >
      <DropdownTrigger>
        <Button
          className="text-md bg-zinc-300 text-black w-[40px] !h-full"
          isIconOnly
          size="sm"
        >
          {selectedKeys}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        selectionMode="single"
        onSelectionChange={(e) => {
          setSelectedKeys(Array.from(e)[0] as string);
          setDataClient(category_id, product_id, Array.from(e)[0] as number);
          updateSelected();
        }}
        selectedKeys={selectedKeys}
        hideSelectedIcon
        className="[&>span]:!text-xs"
        aria-label="number-menu"
        disallowEmptySelection
      >
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((item) => (
          <DropdownItem key={item} aria-label={item} textValue={item}>
            {item}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default TableDropdownQty;
