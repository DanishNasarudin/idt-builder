"use client";
import { Button as ShButton } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { containsSearchTerm } from "@/lib/utils";
import { useSelectStore } from "@/lib/zus-store";
import React from "react";
import { ProductPublicData } from "../page";

type Props = {
  data: ProductPublicData[0];
  disabledKeys: string[];
};

type Selection = "all" | Set<React.Key>;

const TableDropdown = ({ data, disabledKeys }: Props) => {
  const setDataClient = useSelectStore((state) => state.setData);

  const [selectedProductId, setSelectedProductId] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    setSelectedProductId(
      (prev) =>
        (prev = String(data.selected_id === undefined ? "" : data.selected_id)),
    );
  }, [data]);

  const selectedProduct = data.product.find(
    (product) => String(product.product_id) === selectedProductId,
  );

  const handleSelectionChange = (key: Selection) => {
    const keyArray = Array.from(key as Set<React.Key>);

    setDataClient(
      data.category_id,
      keyArray.length > 0 ? (keyArray[0] as string) : null,
      1,
    );
  };

  // console.log(
  //   selectedProductId !== null
  //     ? selectedProductId !== ""
  //       ? [selectedProductId]
  //       : []
  //     : []
  // );

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    // setValue("");
    const timeoutId = setTimeout(() => {
      if (!open) {
        setValue("");
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [open]);

  // console.log(data.product.filter((item) => containsSearchTerm(item, value)));

  return (
    <>
      {/* <Select
        className="!text-xs text-black hidden"
        size="sm"
        radius="sm"
        popoverProps={{
          placement: "bottom-start",
        }}
        // defaultSelectedKeys={[""]}
        // placeholder={data.category_name as string}
        selectedKeys={
          selectedProductId !== null
            ? selectedProductId !== ""
              ? [selectedProductId]
              : []
            : []
        }
        label={data.category_name as string}
        onSelectionChange={handleSelectionChange}
        disabledKeys={disabledKeys}
        classNames={{
          trigger: `overflow-ellipsis overflow-hidden justify [&>span]:[&>div]:!text-[10px] whitespace-pre-wrap [&>span]:[&>div]:!text-left
            bg-zinc-300 mobilehover:hover:bg-zinc-400 transition-all [&>span]:[&>div]:!text-black [&>span]:[&>div]:!font-bold  [&>span]:[&>div]:max-w-[30vw] sm:[&>span]:[&>div]:max-w-[90vw]`,
          popoverContent: "bg-zinc-300 text-black max-w-[90vw]",
          label: "!text-black text-[12px] text-left",
        }}
        isMultiline
      >
        {data.product.map((item) => {
          return (
            <SelectItem
              aria-label={item.product_name as string}
              key={item.product_id}
              value={item.product_id}
              // showDivider
              className={`[&>span]:!text-xs py-1 after:bg-zinc-400 after:opacity-50 ${
                disabledKeys.find((dk) => dk === String(item.product_id))
                  ? "text-accent opacity-100"
                  : ""
              }`}
              textValue={
                String(item.product_name)
                  ? `${String(item.product_name)} | RM ${item.unit_price}`
                  : "empty"
              }
            >
              {item.product_name}{" "}
              {item.is_label
                ? ``
                : `|
              RM${item.unit_price}`}
            </SelectItem>
          );
        })}
      </Select>
      <Command
        className="rounded-lg border shadow-md hidden"
        loop
        // shouldFilter={false}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          {data.product.map((item) => {
            return (
              <CommandItem
                aria-label={item.product_name as string}
                key={item.product_id}
                // showDivider
                className={`[&>span]:!text-xs py-1 after:bg-zinc-400 after:opacity-50 ${
                  disabledKeys.find((dk) => dk === String(item.product_id))
                    ? "text-accent opacity-100"
                    : ""
                }`}
              >
                {item.product_name}{" "}
                {item.is_label
                  ? ``
                  : `|
              RM${item.unit_price}`}
              </CommandItem>
            );
          })}
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ShButton
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="
            w-full justify-start overflow-hidden overflow-ellipsis whitespace-pre-wrap bg-zinc-300
            text-left !text-[10px] !font-bold !text-black transition-all mobilehover:hover:bg-zinc-400"
          >
            {selectedProductId !== null
              ? selectedProductId !== ""
                ? data.product.find(
                    (item) =>
                      String(item.product_id) === String([selectedProductId]),
                  )?.product_name
                : data.category_name
              : []}
          </ShButton>
        </PopoverTrigger>
        <PopoverContent
          className="w-full !max-w-[80vw] p-0"
          align="start"
          side="bottom"
          avoidCollisions={false}
        >
          <Command className="bg-zinc-300 text-black" shouldFilter={false} loop>
            <CommandInput
              placeholder="Search product..."
              className="h-9 "
              value={value}
              onValueChange={(e) => {
                setValue(e);
              }}
            />
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandList className="w-full font-bold">
              {data.product
                .filter((item) => containsSearchTerm(item, value))
                .map((item) => {
                  return (
                    <CommandItem
                      aria-label={item.product_name as string}
                      key={item.product_id}
                      // showDivider
                      className={`whitespace-pre-wrap py-0 !text-left !text-[10px] ${
                        disabledKeys.find(
                          (dk) => dk === String(item.product_id),
                        )
                          ? "text-accent opacity-100"
                          : ""
                      }
                      ${
                        selectedProductId &&
                        Number(selectedProductId) === item.product_id &&
                        "bg-accent/50"
                      }`}
                      disabled={
                        item.is_label === null ? undefined : item.is_label
                      }
                      value={`${item.product_id}`}
                      onSelect={(e) => {
                        if (
                          selectedProductId &&
                          Number(selectedProductId) === item.product_id
                        ) {
                          setDataClient(data.category_id, null, 1);
                          setOpen(false);
                        } else {
                          setDataClient(data.category_id, e, 1);
                          setOpen(false);
                        }
                      }}
                    >
                      {item.is_soldout && "[SOLD OUT]"} {item.product_name}{" "}
                      {item.is_label ? `` : `| RM${item.unit_price}`}
                    </CommandItem>
                  );
                })}
              {/* <CommandItem>Test</CommandItem> */}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default TableDropdown;
