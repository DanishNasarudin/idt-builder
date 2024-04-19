"use client";

import { useSelectStore } from "@/lib/zus-store";
import { Select, SelectItem } from "@nextui-org/react";

const items = [
  {
    key: "public-bank",
    label: "Public Bank",
  },
  {
    key: "aeon",
    label: "AEON Credit Card",
  },
  {
    key: "affin-bank",
    label: "Affin Bank",
  },
  {
    key: "rhb-bank",
    label: "RHB Bank",
  },
  {
    key: "ambank",
    label: "AMBANK",
  },
  {
    key: "hsbc",
    label: "HSBC",
  },
  {
    key: "sc-bank",
    label: "Standard Chartered Bank",
  },
  {
    key: "bsn",
    label: "Bank Simpanan Nasional",
  },
  {
    key: "ocbc",
    label: "OCBC",
  },
  {
    key: "uob",
    label: "UOB",
  },
];

const Installments = () => {
  const data = useSelectStore((state) => state.selectedData);

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-col items-center">
        <h2>Installment Options</h2>
        <p>(Walk-in Only)</p>
      </div>
      <div className="mx-auto flex w-full max-w-[400px] flex-col items-center gap-2">
        <Select
          aria-label="banks"
          className="items-center"
          classNames={{
            trigger:
              "bg-accent [&>span]:[&>div]:!font-bold [&>span]:[&>div]:text-center",
          }}
          defaultSelectedKeys={["public-bank"]}
          popoverProps={{ placement: "bottom" }}
        >
          {items.map((option) => {
            return (
              <SelectItem key={option.key} value={option.label}>
                {option.label}
              </SelectItem>
            );
          })}
        </Select>
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <div className="w-full rounded-md bg-zinc-300 p-4 text-center text-black">
            <b style={{ fontSize: 12 }}>Installment with</b> <br />
            <b style={{ color: "#009BFF", fontSize: 20 }}>12 months</b> <br />
            <b style={{ fontSize: 12 }}>period</b>
          </div>
          <div className="w-full rounded-md bg-zinc-300 p-4 text-center text-black">
            <b style={{ fontSize: 12 }}>Starting from</b> <br />
            <b style={{ color: "#009BFF", fontSize: 20 }}>
              RM {Math.floor(data.grand_total / (1 - 0.04) / 12)}/mo
            </b>{" "}
            <br />
            <b style={{ fontSize: 12 }}>with listed Bank</b>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Installments;
