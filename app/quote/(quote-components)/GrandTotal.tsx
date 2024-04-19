"use client";
import { useSelectStore } from "@/lib/zus-store";

type Props = {};

const GrandTotal = (props: Props) => {
  const data = useSelectStore((state) => state.selectedData);

  return (
    <div className="flex gap-16">
      <h2>
        Grand <br /> Total
      </h2>
      <div className="text-center">
        <p>
          <b style={{ color: "gray", fontSize: 12 }}>
            <s>RM {data.ori_total}</s>
          </b>
          <br />
          <b style={{ fontSize: 20 }}>RM {data.grand_total}</b>
          <br />
          <b style={{ color: "#009BFF", fontSize: 12 }}>
            Save RM {data.ori_total - data.grand_total}
          </b>
        </p>
      </div>
    </div>
  );
};

export default GrandTotal;
