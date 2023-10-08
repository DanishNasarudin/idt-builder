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
  const [quantityOption, setQuantityOption] = useState(3);

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setQuantityOption(Number(value));
  };

  const [toggle, setToggle] = useState(false);

  const [formData, loading] = useCollection(
    query(collection(db, "quote__ids"))
  );

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

  if (loading) {
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
                  <tr key={`${index}-${dataIndex}`} className="">
                    <td className="w-full sm:w-[70%] p-0 flex sm:table-cell flex-col">
                      <div className="mt-4 h-16 pt-8 sm:pt-0 px-12 sm:pl-8 sm:pr-2 bg-secondary/20 rounded-t-2xl sm:rounded-none sm:rounded-l-2xl text-xs flex justify-center flex-col font-bold sm:font-normal gap-4">
                        <div className="flex gap-4">
                          {/* <img
                            src={data.selectedOption.imdisp}
                            alt="img"
                            className="w-10"
                          /> */}
                          {data.selectedOption.name}
                        </div>
                        <div className="border-b-[1px] border-secondary w-full block sm:hidden" />
                      </div>
                    </td>
                    <td className="w-full sm:w-[10%] p-0 block sm:table-cell ">
                      <div className="mt-4 text-center py-6 px-2 bg-secondary/20 text-xs hidden sm:block">
                        {data.selectedOption.price}
                      </div>
                      <div className="flex sm:hidden justify-between bg-secondary/20 px-12 rounded-b-2xl">
                        <div className=" text-center py-6 text-xs flex flex-col gap-4">
                          <label htmlFor="quantity__label">
                            <p style={{ fontSize: "12px" }}>Price</p>
                          </label>
                          {data.selectedOption.price}
                        </div>
                        <div className=" text-center py-6 text-xs flex flex-col gap-4">
                          <label htmlFor="quantity__label">
                            <p style={{ fontSize: "12px" }}>Quantity</p>
                          </label>
                          {data.quantity}
                        </div>
                        <div className=" text-center py-6 text-xs flex flex-col gap-4 text-green-300 font-bold">
                          <label htmlFor="total__label">
                            <p style={{ fontSize: "12px" }}>Total</p>
                          </label>
                          {data.total}
                        </div>
                      </div>
                    </td>
                    <td className="w-full sm:w-[10%] p-0 hidden sm:table-cell">
                      <div className="mt-4 text-center py-6 px-2 bg-secondary/20 text-xs">
                        {data.quantity}
                      </div>
                    </td>
                    <td className="w-full sm:w-[10%] p-0 hidden sm:table-cell">
                      <div className="mt-4 text-center py-6 px-8 bg-secondary/20 rounded-r-2xl text-xs">
                        {data.total}
                      </div>
                    </td>
                  </tr>
                ));
              }
              return null;
            })}
        </tbody>

        {/* <tfoot>
          <tr>
            <td colSpan={3} className="w-[90%] p-0">
              <div className="mt-4 py-4 px-12 sm:px-8 bg-secondary text-black font-bold rounded-2xl sm:rounded-none sm:rounded-l-2xl flex justify-between w-full align-middle items-center">
                Grand Total
                <div className=" text-center py-4 bg-secondary text-black font-bold rounded-r-2xl block sm:hidden">
                  {formData &&
                    quoteId &&
                    formData.docs.map((item) => {
                      if (item.id === quoteId) {
                        return item.data().grandTotal;
                      }
                      return null;
                    })}
                </div>
              </div>
            </td>
            <td className="w-[10%] p-0 hidden sm:table-cell">
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
        </tfoot> */}
      </table>
      <div className="flex flex-col pt-16 gap-16 items-center mx-auto w-full">
        <div className="flex gap-16">
          <h2>
            Grand <br /> Total
          </h2>
          <div className="text-center">
            {formData &&
              quoteId &&
              formData.docs.map((item) => {
                if (item.id === quoteId) {
                  return (
                    <p>
                      <b style={{ color: "gray", fontSize: 12 }}>
                        <s> RM {item.data().oriTotal}</s>
                      </b>
                      <br />
                      <b style={{ fontSize: 20 }}>
                        RM {item.data().grandTotal}
                      </b>
                      <br />
                      {item.data().grandTotal > 0 ? (
                        <b style={{ color: "#009BFF", fontSize: 12 }}>
                          Save RM{" "}
                          {item.data().oriTotal - item.data().grandTotal}
                        </b>
                      ) : (
                        ""
                      )}
                    </p>
                  );
                }
                return null;
              })}
          </div>
        </div>
        <div className="flex gap-4 sm:flex-row flex-col w-full mx-auto flex-wrap justify-center">
          <div className="flex gap-4">
            <select
              name="quantity__name"
              id="quantity__select"
              className="flex text-white w-full sm:w-16 h-28 bg-accent sm:px-4 text-center appearance-none cursor-pointer rounded-2xl font-bold"
              onChange={handleQuantityChange}
              defaultValue={3}
            >
              <option value={1}>3%</option>
              <option value={2}>4%</option>
              <option value={3}>5%</option>
            </select>
            <div className="bg-secondary text-black rounded-2xl h-28 sm:w-40 w-full flex justify-center items-center flex-col">
              <b style={{ fontSize: 12 }}>Installment with</b>
              <b style={{ color: "#009BFF", fontSize: 20 }}>
                {quantityOption == 1 ? 6 : ""}
                {quantityOption == 2 ? 12 : ""}
                {quantityOption == 3 ? 18 : ""} months
              </b>
              <b style={{ fontSize: 12 }}>period</b>
            </div>
          </div>
          {formData &&
            quoteId &&
            formData.docs.map((item) => {
              if (item.id === quoteId) {
                return (
                  <>
                    <div className="flex gap-4">
                      <div className="bg-secondary text-black rounded-2xl h-28 sm:w-40 w-full flex justify-center items-center flex-col">
                        <b style={{ fontSize: 12 }}>Starting from</b>
                        <b style={{ color: "#009BFF", fontSize: 20 }}>
                          RM{" "}
                          {Math.floor(
                            item.data().grandTotal /
                              (1 -
                                (quantityOption == 1
                                  ? 0.03
                                  : quantityOption == 2
                                  ? 0.04
                                  : quantityOption == 3
                                  ? 0.05
                                  : 0)) /
                              (quantityOption == 1
                                ? 6
                                : quantityOption == 2
                                ? 12
                                : quantityOption == 3
                                ? 18
                                : 0)
                          )}
                          /mo
                        </b>
                        <b style={{ fontSize: 12 }}>with AEON CC</b>
                      </div>
                      <div className="bg-secondary text-black rounded-2xl h-28 sm:w-40 w-full flex justify-center items-center flex-col">
                        <b style={{ fontSize: 12 }}>Interest</b>
                        <b style={{ color: "#009BFF", fontSize: 20 }}>
                          RM{" "}
                          {Math.floor(
                            item.data().grandTotal /
                              (1 -
                                (quantityOption == 1
                                  ? 0.03
                                  : quantityOption == 2
                                  ? 0.04
                                  : quantityOption == 3
                                  ? 0.05
                                  : 0))
                          ) - item.data().grandTotal}
                        </b>
                        <b style={{ fontSize: 12 }}>
                          {quantityOption == 1
                            ? "3%"
                            : quantityOption == 2
                            ? "4%"
                            : quantityOption == 3
                            ? "5%"
                            : ""}
                        </b>
                      </div>
                    </div>
                  </>
                );
              }
              return null;
            })}
          {formData &&
            quoteId &&
            formData.docs.map((item) => {
              if (item.id === quoteId) {
                return (
                  <div className="bg-secondary text-black rounded-2xl h-28 sm:w-40 w-full flex justify-center items-center flex-col">
                    <b style={{ fontSize: 12 }}>Total</b>
                    <b style={{ color: "#009BFF", fontSize: 20 }}>
                      RM{" "}
                      {Math.floor(
                        item.data().grandTotal /
                          (1 -
                            (quantityOption == 1
                              ? 0.03
                              : quantityOption == 2
                              ? 0.04
                              : quantityOption == 3
                              ? 0.05
                              : 0))
                      )}
                    </b>
                    <b style={{ fontSize: 12 }}>with Installment</b>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>
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
