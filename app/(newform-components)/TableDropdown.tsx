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
import { cn, containsSearchTerm } from "@/lib/utils";
import { ProductItemSelectionData, useUserSelected } from "@/lib/zus-store";
import React from "react";

type Props = {
  data: ProductItemSelectionData;
  disabledKeys: string[];
};

type Selection = "all" | Set<React.Key>;

const TableDropdown = ({ data, disabledKeys }: Props) => {
  const setDataClient = useUserSelected((state) => state.setData);

  const [selectedProductId, setSelectedProductId] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    setSelectedProductId(
      (prev) =>
        (prev = String(data.selected_id === undefined ? "" : data.selected_id))
    );
  }, [data]);

  const selectedProduct = data.products.find(
    (product) => String(product.product_id) === selectedProductId
  );

  const handleSelectionChange = (key: Selection) => {
    const keyArray = Array.from(key as Set<React.Key>);

    setDataClient(
      data.category_id,
      keyArray.length > 0 ? (keyArray[0] as number) : null,
      1
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
                ? data.products.find(
                    (item) =>
                      String(item.product_id) === String([selectedProductId])
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
              {data.products
                .filter((item) => containsSearchTerm(item, value))
                .map((item) => {
                  return (
                    <CommandItem
                      aria-label={item.product_name as string}
                      key={item.product_id}
                      // showDivider
                      className={cn(
                        "whitespace-pre-wrap py-0 !text-left !text-[10px]",
                        item.is_label ? "!text-accentOwn !opacity-100" : "",
                        selectedProductId &&
                          Number(selectedProductId) === item.product_id &&
                          "bg-accentOwn/50"
                      )}
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
                          setDataClient(data.category_id, Number(e), 1);
                          setOpen(false);
                        }
                      }}
                    >
                      {item.product_name}{" "}
                      {item.is_label ? (
                        ``
                      ) : (
                        <div className="flex">
                          <p className="text-[10px]">{"| "}</p>
                          <p
                            className={cn(
                              "text-[10px]",
                              item.is_discounted && "text-green-700"
                            )}
                          >
                            RM{item.dis_price}
                          </p>
                        </div>
                      )}
                    </CommandItem>
                  );
                })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default TableDropdown;
