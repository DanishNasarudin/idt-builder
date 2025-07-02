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
import { Kbd } from "@nextui-org/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUserSelected } from "@/lib/zus-store";
import React from "react";
import { ProductTypeSearch } from "../../app/page";

type Props = {
  data: ProductTypeSearch;
};

export default function TableSearch({ data }: Props) {
  // Shortcut function ---------------------------------------------------
  const [open, setOpen] = React.useState(false);
  function useKey(
    key: string,
    ref: React.MutableRefObject<HTMLInputElement | null>
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

  // Search functions -----------------------------------------------------

  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchDisplay, setSearchDisplay] = React.useState("");

  const [searchData, setSearchData] = React.useState<ProductTypeSearch>([]);

  React.useEffect(() => {
    setSearchData(data);
  }, []);

  React.useEffect(() => {
    if (searchTerm) {
      setSearchData(() => {
        const newData = data.filter((order) =>
          Object.values(order).some((value) => {
            if (typeof value === "string" && !order.is_label) {
              const terms = searchTerm.split(" ");
              return terms.every((term) =>
                value.toLowerCase().includes(term.toLowerCase())
              );
            }
            return false;
          })
        );
        return newData;
      });
    } else {
      setSearchData(data.filter((order) => !order.is_label));
    }
  }, [searchTerm]);

  const setDataClient = useUserSelected((state) => state.setData);
  const updateSelected = useUserSelected((state) => state.updateSelected);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            className={cn(
              `relative
            w-full justify-start overflow-hidden overflow-ellipsis whitespace-pre-wrap bg-white
            text-left !text-[10px] !font-bold !text-zinc-500 transition-all mobilehover:hover:bg-zinc-400`,
              searchDisplay && "!text-black"
            )}
          >
            {searchDisplay ? searchDisplay : "Search product..."}
            <Kbd className="absolute right-4 whitespace-nowrap rounded-sm bg-white text-black">
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
          <Command
            className="bg-white text-black max-w-[90vw]"
            shouldFilter={false}
            loop
          >
            <CommandInput
              placeholder="Search product..."
              className={`h-9 ${searchDisplay && ""}`}
              value={searchTerm}
              onValueChange={(e) => {
                setSearchTerm(e);
              }}
              ref={keyRef}
            />
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandList className="max-h-[500px] w-full  font-bold ">
              <ScrollArea className="rounded-md border">
                {searchData.slice(0, searchTerm ? 200 : 30).map((item) => {
                  return (
                    <CommandItem
                      aria-label={item.product_name as string}
                      key={`${item.category_id}_${item.product_id}`}
                      // showDivider
                      className={cn(
                        "whitespace-pre-wrap py-0 !text-left !text-[12px]  data-[selected=true]:bg-primary",
                        item.is_label ? "!text-primary !opacity-100" : ""
                      )}
                      disabled={item.is_label}
                      value={`${item.category_id}_${item.product_id}`}
                      onSelect={(e) => {
                        // console.log(e);
                        const [category_id, product_id] = String(e).split("_");
                        setSearchDisplay(`${item.product_name}`);
                        setDataClient(
                          Number(category_id),
                          Number(product_id),
                          1
                        );
                        updateSelected();
                        setOpen(false);
                      }}
                    >
                      {item.product_name}{" "}
                      {!item.is_label && (
                        <div className="flex">
                          <p className="text-[12px]">{"| "}</p>
                          <p
                            className={cn(
                              "text-[12px]",
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
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
