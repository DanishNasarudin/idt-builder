"use client";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { useSelectStore } from "@/lib/zus-store";
import { Kbd } from "@nextui-org/react";
import React from "react";
import { ProductData, ProductPublicSearchData } from "../page";

type Props = {
  disabledKeys: string[];
  data: ProductData;
};

const flattenSearchData = (data: ProductData): ProductPublicSearchData => {
  return data.flatMap(({ id, name, product }) =>
    product.map(
      ({
        id: productId,
        product_name,
        ori_price,
        dis_price,
        is_available,
        is_label,
        category_id,
        is_soldout,
      }) => ({
        category_id: id,
        category_name: name,

        product_id: productId,
        product_name,
        ori_price,
        dis_price,
        is_available,
        is_label,
        ignore_id: category_id,
        is_soldout,
      }),
    ),
  );
};

const TableSearch = ({ disabledKeys, data }: Props) => {
  // let filteredData = flattenData(data);
  const [open, setOpen] = React.useState(false);
  function useKey(
    key: string,
    ref: React.MutableRefObject<HTMLInputElement | null>,
  ) {
    React.useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      function hotkeyPress(e: KeyboardEvent) {
        if (e.ctrlKey && e.key === key) {
          e.preventDefault();
          setOpen(true);
          if (ref.current === null) return;
          timeoutId = setTimeout(() => ref.current?.focus(), 500);
          // ref.current.focus();
          return;
        }
      }

      document.addEventListener("keydown", hotkeyPress);
      return () => {
        document.removeEventListener("keydown", hotkeyPress);
        clearTimeout(timeoutId);
      };
    }, [key, open]);
  }

  const keyRef = React.useRef<HTMLInputElement>(null);
  useKey("k", keyRef);

  const [searchTerm, setSearchTerm] = React.useState("");

  const [searchData, setSearchData] = React.useState<ProductPublicSearchData>(
    [],
  );
  const [allData, setAllData] = React.useState<ProductPublicSearchData>([]);

  const [searchDisplay, setSearchDisplay] = React.useState("");

  React.useEffect(() => {
    const initialData = flattenSearchData(data);
    setSearchData(initialData);
    setAllData(initialData);
  }, []);

  React.useEffect(() => {
    if (searchTerm) {
      // console.log("pass");
      setSearchData((prev) => {
        const newData = allData.filter((order) =>
          Object.values(order).some((value) => {
            if (typeof value === "string" && !order.is_label) {
              const terms = searchTerm.split(" ");

              return terms.every((term) =>
                value.toLowerCase().includes(term.toLowerCase()),
              );
            }
            return false;
          }),
        );
        return newData;
      });
    } else {
      setSearchData(allData.filter((order) => !order.is_label));
    }
  }, [searchTerm, allData]);

  // console.log(searchData);
  const setDataClient = useSelectStore((state) => state.setData);

  // console.log(open, "check");

  return (
    <>
      {/* <Autocomplete
        disabledKeys={disabledKeys}
        clearIcon
        isClearable
        aria-label="search"
        onKeyDown={(e: any) => e.continuePropagation()}
        items={searchData.slice(0, 30)}
        onValueChange={(e) => {
          setSearchTerm(e);
        }}
        onSelectionChange={(e) => {
          const [category_id, product_id] = String(e).split("_");
          setDataClient(Number(category_id), product_id, 1);
        }}
        popoverProps={{ placement: "bottom" }}
        endContent={
          <>
            <Kbd className="bg-zinc-300 text-black whitespace-nowrap">
              Ctrl + K
            </Kbd>
          </>
        }
        ref={keyRef}
        className="[&>div]:[&>div]:[&>div]:!bg-zinc-300 [&>input]:[&>div]:[&>div]:[&>div]:[&>div]:!text-black hidden"
        classNames={{
          popoverContent: "bg-zinc-300 text-black",
          selectorButton: "text-black",
        }}
      >
        {(item) => (
          <AutocompleteItem
            key={`${item.category_id}_${item.product_id}`}
            className=""
          >
            {item.product_name}
          </AutocompleteItem>
        )}
      </Autocomplete> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            className={cn(
              `relative
            w-full justify-start overflow-hidden overflow-ellipsis whitespace-pre-wrap bg-zinc-300
            text-left !text-[10px] !font-bold !text-zinc-500 transition-all mobilehover:hover:bg-zinc-400`,
              searchDisplay && "!text-black",
            )}
          >
            {searchDisplay ? searchDisplay : "Search product..."}
            <Kbd className="absolute right-4 whitespace-nowrap rounded-sm bg-zinc-300 text-black">
              Ctrl + K
            </Kbd>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start"
          side="bottom"
          avoidCollisions={false}
        >
          <Command className="bg-zinc-300 text-black" shouldFilter={false} loop>
            <CommandInput
              placeholder="Search product..."
              className="h-9 "
              value={searchTerm}
              onValueChange={(e) => {
                setSearchTerm(e);
              }}
              ref={keyRef}
            />
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandList className="w-full max-w-[30vw] font-bold sm:max-w-[90vw]">
              {searchData.slice(0, 30).map((item) => {
                return (
                  <CommandItem
                    aria-label={item.product_name as string}
                    key={`${item.category_id}_${item.product_id}`}
                    // showDivider
                    className={`whitespace-pre-wrap py-0 !text-left !text-[10px] ${
                      disabledKeys.find((dk) => dk === String(item.product_id))
                        ? "text-accent opacity-100"
                        : ""
                    }`}
                    disabled={
                      item.is_label === null ? undefined : item.is_label
                    }
                    value={`${item.category_id}_${item.product_id}`}
                    onSelect={(e) => {
                      // console.log(e);
                      const [category_id, product_id] = String(e).split("_");
                      setSearchDisplay(`${item.product_name}`);
                      setDataClient(Number(category_id), product_id, 1);
                      setOpen(false);
                    }}
                  >
                    {item.product_name}{" "}
                    {item.is_label
                      ? ``
                      : `| RM${
                          item.dis_price !== null
                            ? item.dis_price
                            : item.ori_price
                        }`}
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

export default TableSearch;
