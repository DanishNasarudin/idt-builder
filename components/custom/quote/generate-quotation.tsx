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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserSelected } from "@/lib/zus-store";
import { pdf } from "@react-pdf/renderer/lib/react-pdf.browser";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Calendar from "./calendar";

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

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

      const blob = await pdf(
        <Quotation
          branch={branch as Branch}
          toAddress={toAddress}
          date={format(date || new Date(), "dd/MM/yyyy")}
          type={type}
          subTotal={quoteData.grand_total}
          total={quoteData.grand_total}
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
    },
    [branch, date, quoteData, toAddress]
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
                      <DropdownMenuRadioItem value="Invoice">
                        Invoice
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
            <div className="grid gap-2">
              <Label htmlFor="to-add&#8204;ress">Receiver Address</Label>
              <Textarea
                id="to-add&#8204;ress"
                rows={6}
                onChange={(e) => setToAddress(e.currentTarget.value)}
                placeholder={`Example:\nIDEAL TECH PC SDN BHD\n17, Jalan Pandan Prima 1, Dataran Pandan Prima, 55100 Kuala Lumpur.\nHP: +6012-5787804 sales@idealtech.com.my\nTIN: 201401008251`}
              />
            </div>
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
