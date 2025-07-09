"use client";
import { ProductQuoteType, Quotation } from "@/components/pdf/quotation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserSelected } from "@/lib/zus-store";
import { pdf } from "@react-pdf/renderer/lib/react-pdf.browser";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { ChevronsUpDown, Minus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Calendar from "./calendar";

type ParsedQuote = {
  products: ProductQuoteType[];
  subTotal: number;
  total: number;
};

type Branch = "ampang" | "sa" | "ss2" | "jb";

const branchNameDropdown = {
  ampang: "Ampang HQ",
  sa: "Setia Alam",
  ss2: "SS2, PJ",
  jb: "Johor Bahru",
};

export default function GenerateQuotation() {
  const today = useMemo(() => new Date(), []);
  const [branchLocal, setBranchLocal] = useLocalStorage<string>(
    "branch",
    "ampang"
  );

  const [type, setType] = useState("Quotation");
  const [branch, setBranch] = useState("ampang");
  const [toAddress, setToAddress] = useState("");
  const [isComputerGenerated, setIsComputerGenerated] = useState("True");
  const [pcType, setPcType] = useState("Custom");
  const [packageSpecs, setPackageSpecs] = useState("");
  const [additional, setAdditional] = useState<ProductQuoteType[]>([]);
  const [date, setDate] = useState<Date | undefined>(today);
  const quoteData = useUserSelected((state) => state.selected);

  const getCategory = (name: string) => {
    if (name.includes("Motherboard")) return "Motherboard: ";
    if (name.includes("Processor")) return "Processor: ";
    if (name.includes("Cooler")) return "Cooler: ";
    if (name.includes("RAM")) return "RAM: ";
    if (name.includes("Graphic Card")) return "GPU: ";
    if (name.includes("PowerSupplyUnit") || name.includes("PSU"))
      return "Power Supply: ";
    if (name.includes("Case")) return "Casing: ";
    if (name.includes("SSD")) return "SSD: ";
    if (name.includes("HDD")) return "HDD: ";
    if (name.includes("Monitor")) return "";
    if (name.includes("Keyboard") && name.includes("Mouse")) return "Combo: ";
    if (name.includes("Keyboard")) return "Keyboard: ";
    if (name.includes("Mouse")) return "Mouse: ";
    if (name.includes("Mousepad")) return "Mousepad: ";
    if (name.includes("Headsets")) return "Headsets: ";
    if (name.includes("Speaker")) return "Speaker: ";
    if (name.includes("Fans")) return "Fans: ";
    if (name.includes("WIFI Receiver")) return "WIFI Receiver: ";
    if (name.includes("WIFI Router")) return "WIFI Router: ";
    if (name.includes("Optical Drive")) return "Optical Drive: ";
    if (name.includes("Software")) return "Software: ";
    if (name.includes("Accessories-Other")) return "";
    if (
      name.includes("MIC") ||
      name.includes("Webcam") ||
      name.includes("Capture Card") ||
      name.includes("Streaming") ||
      name.includes("Sound Card")
    ) {
      return "";
    }
    if (name.includes("Drawing Tablet")) return "";
    if (name.includes("Gaming Chair")) return "Gaming Chair: ";
    if (name.includes("Gaming Desk")) return "Gaming Desk: ";
    if (name.includes("New PC Accessories")) return "";

    return "";
  };

  const parseStringQuote = (input: string): ParsedQuote => {
    const lines = input
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l);

    let subTotal = 0;
    let total = 0;
    const baseLines: string[] = [];
    const manual: ProductQuoteType[] = [];
    const upgrades: ProductQuoteType[] = [];
    const addons: ProductQuoteType[] = [];
    let section: "base" | "upgrades" | "addons" = "base";

    for (const line of lines) {
      if (/^SUBTOTAL PRICE:/i.test(line)) {
        const m = line.match(/RM\s*([\d,.]+)/i);
        if (m) subTotal = parseFloat(m[1].replace(/,/g, ""));
        continue;
      }
      if (/^FINAL TOTAL PRICE:/i.test(line) || /^TOTAL PRICE:/i.test(line)) {
        const m = line.match(/RM\s*([\d,.]+)/i);
        if (m) total = parseFloat(m[1].replace(/,/g, ""));
        continue;
      }
      if (/^Upgrades:\s*$/i.test(line)) {
        section = "upgrades";
        continue;
      }
      if (/^Add On:\s*$/i.test(line)) {
        section = "addons";
        continue;
      }

      if (section === "base") {
        const regex = /^(.+?)\s*-\s*RM\s*([\d.,]+)/i;
        const m = line.match(regex);
        if (m) {
          const name = m[1].trim();
          const price = parseFloat(m[2].replace(/,/g, ""));
          const item: ProductQuoteType = {
            name: name,
            quantity: 1,
            unitPrice: price,
          };
          manual.push(item);
        } else {
          baseLines.push(line);
        }
      } else {
        const regex =
          section === "addons"
            ? /^(?:Add\s*On:\s*)?(.+?)\s*-\s*RM\s*([\d.,]+)/i
            : /^(.+?)\s*-\s*RM\s*([\d.,]+)/i;

        const m = line.match(regex);
        if (m) {
          const name = m[1].trim();
          const price = parseFloat(m[2].replace(/,/g, ""));
          const tag = section === "upgrades" ? "Upgrade: " : "Add On: ";
          const item: ProductQuoteType = {
            name: `${tag}${name}`,
            quantity: 1,
            unitPrice: price,
          };
          if (section === "upgrades") upgrades.push(item);
          else addons.push(item);
        }
      }
    }

    const products: ProductQuoteType[] = baseLines.map((name, i) => ({
      name,
      quantity: 1,
      unitPrice: i === 0 ? (subTotal === 0 ? total : subTotal) : 0,
    }));

    products.push(...manual, ...upgrades, ...addons);

    if (total === 0) {
      total = products.reduce((sum, p) => sum + p.unitPrice, 0);
    }

    return { products, subTotal: total, total };
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (pcType === "Package") {
        const { products, subTotal, total } = parseStringQuote(packageSpecs);

        const blob = await pdf(
          <Quotation
            branch={branch as Branch}
            toAddress={toAddress}
            date={format(date || new Date(), "dd/MM/yyyy")}
            type={type}
            isComputerGenerated={isComputerGenerated.toLowerCase() === "true"}
            subTotal={subTotal}
            total={total}
            products={products}
          />
        ).toBlob();

        const now = new Date();
        const filename = `${format(
          now,
          "yyyyMMdd_HHmm"
        )}_IdealTechPC_Quotation.pdf`;

        saveAs(blob, filename);
        setToAddress("");
        return;
      }

      const products: ProductQuoteType[] =
        quoteData?.product_items?.map((item) => ({
          name: `${getCategory(
            item.category_name
          )}${item.products[0].product_name
            .replace(/ *(\([^)]*\)|\[[^\]]*\]) */g, " ")
            .replace(/\s+/g, " ")
            .trim()}`,
          quantity: item.qty,
          unitPrice: item.sub_total,
        })) ?? [];

      const fullProduct = [...products, ...additional];
      const fullTotal = fullProduct.reduce(
        (sum, p) => sum + p.unitPrice * p.quantity,
        0
      );

      const blob = await pdf(
        <Quotation
          branch={branch as Branch}
          toAddress={toAddress}
          date={format(date || new Date(), "dd/MM/yyyy")}
          type={type}
          isComputerGenerated={Boolean(
            isComputerGenerated.toLowerCase() === "true"
          )}
          subTotal={
            quoteData.grand_total > fullTotal
              ? quoteData.grand_total
              : fullTotal
          }
          total={
            quoteData.grand_total > fullTotal
              ? quoteData.grand_total
              : fullTotal
          }
          products={[...products, ...additional]}
        />
      ).toBlob();

      const now = new Date();
      const filename = `${format(
        now,
        "yyyyMMdd_HHmm"
      )}_IdealTechPC_Quotation.pdf`;

      saveAs(blob, filename);
      setToAddress("");
    },
    [
      branch,
      date,
      quoteData,
      toAddress,
      isComputerGenerated,
      type,
      pcType,
      additional,
      packageSpecs,
    ]
  );

  useEffect(() => {
    if (branch !== branchLocal) setBranch(branchLocal);
  }, [branchLocal]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Generate Quote</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[600px]"
      >
        <DialogHeader>
          <DialogTitle>Generate Quote</DialogTitle>
          <DialogDescription>
            This will generate quotation with the following details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2 items-start">
                <Label htmlFor="branch">Type</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} className="w-min">
                      {type} <ChevronsUpDown className="text-foreground/60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={type}
                      onValueChange={(e) => {
                        setType(e);
                      }}
                    >
                      <DropdownMenuRadioItem value="Quotation">
                        Quotation
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Proforma Invoice">
                        Proforma Invoice
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid gap-2 items-start">
                <Label htmlFor="branch">Branch</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} className="w-min">
                      {branchNameDropdown[branch as Branch]}{" "}
                      <ChevronsUpDown className="text-foreground/60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={branch}
                      onValueChange={(e) => {
                        setBranch(e);
                        setBranchLocal(e);
                      }}
                    >
                      <DropdownMenuRadioItem value="ampang">
                        Ampang HQ
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="sa">
                        Setia Alam
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="ss2">
                        SS2, PJ
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="jb">
                        Johor Bahru
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Quote Date</Label>
                <Calendar
                  id="date"
                  value={date}
                  onValueChange={(_, newValue) => setDate(newValue)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2 items-start">
                <Label htmlFor="branch">Is System Generated</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} className="w-min">
                      {`${isComputerGenerated}`}{" "}
                      <ChevronsUpDown className="text-foreground/60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={`${isComputerGenerated}`}
                      onValueChange={(e) => {
                        setIsComputerGenerated(e);
                      }}
                    >
                      <DropdownMenuRadioItem value="True">
                        True
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="False">
                        False
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div></div>
              <div className="grid gap-2 items-start">
                <Label htmlFor="branch">PC Type</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} className="w-min">
                      {pcType} <ChevronsUpDown className="text-foreground/60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={pcType}
                      onValueChange={(e) => {
                        setPcType(e);
                      }}
                    >
                      <DropdownMenuRadioItem value="Custom">
                        Custom
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Package">
                        Package
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to-add&#8204;ress">Receiver Address</Label>
              <Textarea
                id="to-add&#8204;ress"
                rows={6}
                onChange={(e) => setToAddress(e.currentTarget.value)}
                placeholder={`Example:\nIDEAL TECH PC SDN BHD\n17, Jalan Pandan Prima 1, Dataran Pandan Prima, 55100 Kuala Lumpur.\nHP: +6012-5787804 sales@idealtech.com.my\nTIN: 201401008251`}
              />
            </div>
            {pcType === "Package" && (
              <div className="grid gap-2">
                <Label htmlFor="package-specs">Package Specs</Label>
                <Textarea
                  id="package-specs"
                  rows={6}
                  onChange={(e) => setPackageSpecs(e.currentTarget.value)}
                  placeholder={`Paste from the package pc copy specs`}
                />
              </div>
            )}
            {pcType === "Custom" && (
              <div className="grid gap-2">
                {additional.length > 0 && (
                  <div className="flex gap-2 text-sm text-foreground/60">
                    <div className="flex-1">Product name</div>
                    <div className="min-w-[36px]">Qty</div>
                    <div className="min-w-[100px]">Unit price</div>
                    <div className="min-w-[36px]"></div>
                  </div>
                )}
                {additional.length > 0 &&
                  additional.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        className="w-full text-sm"
                        value={item.name}
                        placeholder="Prod&#8204;uct nam&#8204;e"
                        onChange={(e) =>
                          setAdditional((prev) =>
                            prev.map((p, pidx) =>
                              pidx === idx ? { ...p, name: e.target.value } : p
                            )
                          )
                        }
                      />
                      <Input
                        className="min-w-[36px] flex-1 text-sm"
                        value={item.quantity}
                        onChange={(e) =>
                          setAdditional((prev) =>
                            prev.map((p, pidx) =>
                              pidx === idx
                                ? {
                                    ...p,
                                    quantity: Number.isNaN(
                                      Number(e.target.value)
                                    )
                                      ? 0
                                      : Number(e.target.value),
                                  }
                                : p
                            )
                          )
                        }
                      />
                      <Input
                        className="min-w-[100px] flex-1 text-sm"
                        value={item.unitPrice}
                        placeholder="Un&#8204;it pri&#8204;ce"
                        onChange={(e) =>
                          setAdditional((prev) =>
                            prev.map((p, pidx) =>
                              pidx === idx
                                ? {
                                    ...p,
                                    unitPrice: Number.isNaN(
                                      Number(e.target.value)
                                    )
                                      ? 0
                                      : Number(e.target.value),
                                  }
                                : p
                            )
                          )
                        }
                      />
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className="shrink-0"
                        onClick={() => {
                          setAdditional((prev) =>
                            prev.filter((p, pidx) => pidx !== idx)
                          );
                        }}
                      >
                        <Minus />
                      </Button>
                    </div>
                  ))}
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() =>
                    setAdditional((prev) => [
                      ...prev,
                      { name: "Product 1", quantity: 1, unitPrice: 0 },
                    ])
                  }
                >
                  Add Additional Product
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2 w-full justify-end">
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
