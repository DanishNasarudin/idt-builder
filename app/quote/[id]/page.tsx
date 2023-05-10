"use client";

import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { RiArrowDropDownFill, RiArrowDropLeftFill } from "react-icons/ri";

import { db } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { useCollection } from "react-firebase-hooks/firestore";

const inter = Inter({ subsets: ["latin"] });

type Props = {};

function QuotePage({}: Props) {
  const [toggle, setToggle] = useState(false);

  const [formData] = useCollection(query(collection(db, "quote__ids")));

  const pathname = usePathname();

  const fullUrl = `${window.location.protocol}//${window.location.host}${pathname}`;

  // console.log(pathname.includes(formData!.docs[0].id));

  // console.log(formData?.docs[0].data());

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      await navigator.clipboard.writeText(fullUrl);
      setTooltipVisible(true);
      setTimeout(() => {
        setTooltipVisible(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const [quoteId, setQuoteId] = useState<string | null>(null);

  useEffect(() => {
    const pathArray = pathname!.split("/");
    const id = pathArray[pathArray.length - 1];
    if (id) {
      setQuoteId(id);
    }
  }, [pathname]);

  if (!formData) {
    return (
      <h2 className="flex flex-col justify-center items-center h-[100vh] text-center">
        Loading...
      </h2>
    );
  }

  return (
    <div className={`${inter.className} flex flex-col w-4/5 mx-auto`}>
      <div className="text-center py-16">
        <h2>Quotation from Ideal Tech PC</h2>
        <br />
        <p>
          Thank you for using Ideal Tech PC Builder <br />
          <br />
          Quotation generated on:{" "}
          {formData &&
            quoteId &&
            formData.docs.map((item) => {
              if (item.id === quoteId) {
                return item.data().createdAt.toDate().toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
              }
              return null;
            })}
        </p>
      </div>
      <table className="w-full">
        <thead className="hidden sm:table-header-group">
          <tr>
            <th className="text-left pl-0">
              <label htmlFor="product__label">
                <p>Product</p>
              </label>
            </th>
            <th>
              <label htmlFor="quantity__label">
                <p>Price</p>
              </label>
            </th>
            <th>
              <label htmlFor="quantity__label">
                <p>Quantity</p>
              </label>
            </th>
            <th>
              <label htmlFor="total__label">
                <p>Total</p>
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          {formData &&
            quoteId &&
            formData.docs.map((item, index) => {
              if (item.id === quoteId) {
                const quoteData = item.data().formData;
                return quoteData.map((data: any, dataIndex: number) => (
                  <tr key={`${index}-${dataIndex}`}>
                    <td className="w-[70%] p-0">
                      <div className="mt-4 py-4 pl-8 pr-2 bg-secondary/20 rounded-l-2xl">
                        {data.selectedOption.name}
                      </div>
                    </td>
                    <td className="w-[10%] p-0">
                      <div className="mt-4 text-center py-4 px-2 bg-secondary/20">
                        {data.selectedOption.price}
                      </div>
                    </td>
                    <td className="w-[10%] p-0">
                      <div className="mt-4 text-center py-4 px-2 bg-secondary/20">
                        {data.quantity}
                      </div>
                    </td>
                    <td className="w-[10%] p-0">
                      <div className="mt-4 text-center py-4 px-8 bg-secondary/20 rounded-r-2xl">
                        {data.total}
                      </div>
                    </td>
                  </tr>
                ));
              }
              return null;
            })}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={3} className="w-[90%] p-0">
              <div className="mt-4 py-4 pl-8 pr-2 bg-secondary text-black font-bold rounded-l-2xl">
                Grand Total
              </div>
            </td>
            <td className="w-[10%] p-0">
              <div className="mt-4 text-center py-4 px-8 bg-secondary text-black font-bold rounded-r-2xl">
                {formData &&
                  quoteId &&
                  formData.docs.map((item) => {
                    if (item.id === quoteId) {
                      return item.data().grandTotal;
                    }
                    return null;
                  })}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="text-center py-16 w-[80%] sm:w-[40%] mx-auto">
        <p>
          <b>Next Step</b>
          <br />
          <br />
          Enter your details and submit the quotation. We will contact you.{" "}
          <br />
          <br />
          Or, you may copy the quotation link and send it to us through message.
        </p>
      </div>
      <form className="mx-auto w-[70%] max-w-[500px]">
        <div className="flex gap-4">
          <div className="flex-[4]">
            <label htmlFor="quotation__label">
              <p>Quotation Link</p>
            </label>
            <p>
              <input
                type="url"
                id="quotation__id"
                className="text-black bg-secondary py-2 px-4 w-full max-w-[500px] rounded-xl mt-2 mb-4"
                value={fullUrl}
                readOnly
              />
            </p>
          </div>
          <div className="flex-[1] relative">
            <label htmlFor="copy__label">
              <p className="text-transparent">Copy</p>
            </label>
            <button
              className="
            mt-2 mb-8 py-2 w-full bg-accent rounded-xl font-bold
            mobilehover:hover:bg-accent/50 transition-all"
              onClick={(event) => handleCopy(event)}
            >
              <p>Copy</p>
            </button>
            <span
              className="absolute left-0 top-0 translate-x-[150%] translate-y-[10%] mt-8 ml-4 text-xs text-white bg-black rounded px-2 py-1"
              style={{ display: tooltipVisible ? "block" : "none" }}
            >
              Copied!
            </span>
          </div>
        </div>
        <label htmlFor="name__label">
          <p>Your Name</p>
        </label>
        <p>
          <input
            type="text"
            className="text-black bg-secondary py-2 px-4 w-full max-w-[500px] rounded-xl mt-2 mb-4"
            required
          />
        </p>
        <div className="flex gap-0 sm:gap-8 flex-col sm:flex-row">
          <div className="flex-[3]">
            <label htmlFor="email__label">
              <p>Your Email</p>
            </label>
            <p>
              <input
                type="email"
                className="text-black bg-secondary py-2 px-4 w-full max-w-[500px] rounded-xl mt-2 mb-4"
                required
              />
            </p>
          </div>
          <div className="flex-[2]">
            <label htmlFor="contact__label">
              <p>Contact Number</p>
            </label>
            <p>
              <input
                type="tel"
                className="text-black bg-secondary py-2 px-4 w-full max-w-[500px] rounded-xl mt-2 mb-4"
                pattern="\+60-[0-9]{10}"
                required
                placeholder="+60-123456789"
                onInput={(e) => {
                  const input = e.currentTarget as HTMLInputElement;
                  input.setCustomValidity(
                    input.validity.patternMismatch
                      ? "Please enter a valid Malaysian phone number in the format: +60-123456789"
                      : ""
                  );
                }}
              />
              <span className="error-message" style={{ display: "none" }}>
                Please enter a valid Malaysian phone number in the format:
                +60-123456789
              </span>
            </p>
          </div>
        </div>
        <label htmlFor="state__label">
          <p>Which state are you from?</p>
        </label>
        <div className="relative">
          <p>
            <select
              name="state__name"
              id="state__id"
              className="text-black bg-secondary py-2 px-4 w-full max-w-[500px] rounded-xl mt-2 mb-4 appearance-none cursor-pointer"
              onClick={() => {
                setToggle(!toggle);
              }}
              required
            >
              <option value="kl">Kuala Lumpur</option>
            </select>
          </p>
          <RiArrowDropLeftFill
            size={40}
            className={`absolute top-[0%] sm:right-[0] right-2 sm:translate-y-[-0%] translate-y-[-0%] mt-2 pointer-events-none
                ${toggle ? "hidden" : ""}`}
            color={"black"}
          />
          <RiArrowDropDownFill
            size={40}
            className={`absolute top-[0%] sm:right-[0] right-2 sm:translate-y-[-0%] translate-y-[-0%] mt-2 pointer-events-none
                ${toggle ? "" : "hidden"}`}
            color={"black"}
          />
        </div>
        <label htmlFor="reason__label">
          <p>What are you using the PC for?</p>
        </label>
        <p>
          <textarea
            name="reason__name"
            id="reason__id"
            rows={2}
            className="text-black bg-secondary py-2 px-4 w-full max-w-[500px] rounded-xl mt-2 mb-4"
            required
          />
        </p>
        <label htmlFor="requirements__label">
          <p>Any other requirements you would like?</p>
        </label>
        <p>
          <textarea
            name="requirements__name"
            id="requirements__id"
            rows={2}
            className="text-black bg-secondary py-2 px-4 w-full max-w-[500px] rounded-xl mt-2 mb-4"
          />
        </p>
        <div className="flex justify-around items-center">
          <button
            className="
          py-2 px-4 bg-secondary text-black font-bold rounded-xl
          mobilehover:hover:bg-secondary/80 transition-all"
          >
            <p>Back</p>
          </button>
          <button
            className="
            py-2 px-4 bg-accent text-secondary font-bold rounded-xl border-transparent
          mobilehover:hover:bg-accent/50 transition-all"
          >
            <p>Submit</p>
          </button>
          {/* <button
            className="
          py-2 px-4 bg-secondary text-black font-bold rounded-xl
          mobilehover:hover:bg-secondary/80 transition-all"
          >
            <p>Print</p>
          </button> */}
        </div>
      </form>
    </div>
  );
}

export default QuotePage;
