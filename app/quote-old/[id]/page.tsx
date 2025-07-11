"use client";

import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { RiArrowDropDownFill, RiArrowDropLeftFill } from "react-icons/ri";

import { usePathname, useRouter } from "next/navigation";

import { readData } from "@/services/textDbActions";
import { State } from "country-state-city";
import Link from "next/link";
import React from "react";

import Offers from "@/components/custom/offers";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";

const inter = Inter({ subsets: ["latin"] });

interface FormDataItem {
  category: string;
  selectedOption: { name: string; price: number };
  quantity: number;
  total: number;
}

interface QuoteData {
  id: string;
  formData: FormDataItem[];
  grandTotal: number;
  oriTotal: number;
  createdAt: string;
}

function QuotePage() {
  const pathname = usePathname();

  const fullUrl = `${window.location.protocol}//${window.location.host}${pathname}`;
  const [quoteId, setQuoteId] = useState<string | null>(null);

  useEffect(() => {
    const pathArray = pathname!.split("/");
    const id = pathArray[pathArray.length - 1];
    if (id) {
      setQuoteId(id);
    }
  }, [pathname]);

  const [formData, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const MAX_RETRIES = 5; // maximum number of retries
  const RETRY_DELAY = 2000; // delay between retries in milliseconds (2 seconds)

  useEffect(() => {
    let retryCount = 0;

    const fetchData = async () => {
      if (quoteId === null) {
        console.error("No quote ID provided.");
        setLoading(false);
        return; // Exit early if there is no quoteId
      }
      try {
        const data: QuoteData = await readData(quoteId);
        // console.log(data.length, "check size");

        setQuotes([data]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (retryCount < MAX_RETRIES) {
          console.log("Quote ID not found. Retrying...");
          retryCount++;
          setTimeout(fetchData, RETRY_DELAY);
        } else {
          console.log("Max retries reached. Not retrying further.");
          setLoading(false);
        }
      }
    };
    if (quoteId !== null) fetchData();
  }, [quoteId]);

  // console.log(formData[0].formData[0].category);

  const [quantityOption, setQuantityOption] = useState(2);

  const [toggle, setToggle] = useState(false);

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

  const [copySpecVisual, setCopySpecVisual] = useState(false);

  const handleCopySpec = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigator.clipboard.writeText(copySpec);
    setCopySpecVisual(true);
    setTimeout(() => {
      setCopySpecVisual(false);
    }, 2000);
  };

  // ------------- forms

  // const listData = formData?.docs.data();

  type RowData = {
    selectedOption: {
      name: string;
      price: number;
    };
    quantity: number;
    total: number;
  };
  type ListData = {
    createdAt: string;
    grandTotal: number;
    oriTotal: number;
  };

  let listOutside: any[] = [];
  let listProp: ListData | null = null;
  formData &&
    quoteId &&
    formData.map((item, index) => {
      if (item.id === quoteId) {
        const listData = item.formData;
        const listPropData: ListData = {
          createdAt: new Date(item.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          grandTotal: item.grandTotal,
          oriTotal: item.oriTotal,
        };
        listOutside = listData;
        listProp = listPropData;
      }
    });

  const [emailProp, setEmailProp] = useState({
    quoteDate: "date",
    oriPrice: 0,
    discount: 0,
    totalPrice: 0,
    months:
      quantityOption === 1
        ? 6
        : quantityOption === 2
        ? 12
        : quantityOption === 3
        ? 18
        : 0,
    monthly: 0,
    interest: 0,
    interestPerc: 0,
    totalInstall: 0,
    link: fullUrl,
    name: "",
    email: "",
    contact: "",
    state: "",
    reason: "",
    requirements: "",
  });

  // console.log(emailProp, "email prop");
  // console.log(formData.length, "c");

  function generateRows(data: RowData[]): string {
    return data
      .map(
        (item) => `
    <tr class="email__row" style="border-bottom: 1px solid gray">
      <td style="width: 70%">${item.selectedOption.name}</td>
      <td style="width: 10%">${item.selectedOption.price}</td>
      <td style="width: 10%">${item.quantity}</td>
      <td style="width: 10%">${item.total}</td>
    </tr>
  `
      )
      .join("");
  }

  const emailHTMLRow = generateRows(listOutside);

  function generateCopySpec(data: FormDataItem[]): string {
    return data
      .map(
        (item) =>
          `${item.category
            .replace(/^--\s*\d+\.\s+/, "") // Removes "-- <number>. "
            .replace(/-.+$/, "") // Removes "- and everything after it"
            .replace(/\s+--$/, "") // Removes the trailing "--"
            .trim()}: ` +
          `${item.selectedOption.name.replace(/\([^)]*\)/g, "").trim()}` +
          `${item.quantity > 1 ? " | " : ""}` +
          `${item.quantity > 1 ? `Qty: ${item.quantity}x` : ""}` +
          ` | ` +
          `RM ${item.total}` +
          `\n`
      )
      .join("");
  }

  function generateCopySpec2(data2: ListData | null): string {
    if (data2 === null) {
      return "";
    } else {
      return (
        `${
          data2.oriTotal - data2.grandTotal === 0
            ? ""
            : `Total: RM ${String(data2.oriTotal)}`
        }` +
        `${
          data2.oriTotal - data2.grandTotal === 0
            ? ""
            : `\nDiscount: RM ${String(data2.oriTotal - data2.grandTotal)}`
        }` +
        `\nGrand Total: RM ${String(data2.grandTotal)}`
      );
    }
  }

  let copySpec =
    `${generateCopySpec(listOutside)}\n` + `${generateCopySpec2(listProp)}`;
  // console.log(copySpec);

  function listPropDefine(data: ListData | null) {
    if (data) {
      setEmailProp({
        ...emailProp,
        quoteDate: data.createdAt,
        oriPrice: data.oriTotal,
        totalPrice: data.grandTotal,
        discount: data.oriTotal - data.grandTotal,
        monthly:
          quantityOption === 1
            ? Math.floor(data.grandTotal / (1 - 0.03) / 6)
            : quantityOption === 2
            ? Math.floor(data.grandTotal / (1 - 0.04) / 12)
            : quantityOption === 3
            ? Math.floor(data.grandTotal / (1 - 0.05) / 18)
            : 0,
        interest:
          quantityOption === 1
            ? Math.floor(data.grandTotal / (1 - 0.03)) - data.grandTotal
            : quantityOption === 2
            ? Math.floor(data.grandTotal / (1 - 0.04)) - data.grandTotal
            : quantityOption === 3
            ? Math.floor(data.grandTotal / (1 - 0.05)) - data.grandTotal
            : 0,
        interestPerc:
          quantityOption === 1
            ? 3
            : quantityOption === 2
            ? 4
            : quantityOption === 3
            ? 5
            : 0,
        totalInstall:
          quantityOption === 1
            ? Math.floor(data.grandTotal / (1 - 0.03))
            : quantityOption === 2
            ? Math.floor(data.grandTotal / (1 - 0.04))
            : quantityOption === 3
            ? Math.floor(data.grandTotal / (1 - 0.05))
            : 0,
      });
    }
  }

  // listProp.map((item: ListData) =>

  // );

  // const emailHTMLProp = listPropDefine(listProp);

  let emailHTML =
    `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
  </head>
  <style>
    body {
      padding: 0 200px;
    }
    table {
      border-collapse: collapse;
    }
    .email__head {
      text-align: center;
    }
    .email__head-sub {
      text-align: left;
    }
    .email__table {
      width: 100%;
      margin-top: 16px;
      /* background-color: gray; */
    }
    .email__table-head {
      text-align: start;
    }
    .email__table-body {
      text-align: start;
    }
    .email__table-foot {
      margin-top: 8px;
    }
    .email__row {
      border-bottom: 1px solid gray;
    }
    .email__row > td {
      padding: 8px 0;
    }
    .email__install {
      width: 200px;
      /* background-color: gray; */
      border: 1px solid black;
      margin: 0 20px;
      text-align: center;
      padding: 16px 32px;
    }
    .email__grand {
      display: flex;
    }
    .email__install-main {
      display: flex;
      max-width: 400px;
      max-height: 400px;
      width: 100%;
      margin: 0 auto;
    }
    .email__install-left {
      width: 100%;
      height: 100%;
      padding: 0 4px;
    }
    .email__install-right {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .email__install-right > div {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 4px;
    }
  </style>
  <body>
    <div class="email__head">
      <h1>Quotation from Ideal Tech PC</h1>
      <p>Thank you for using Ideal Tech PC Builder.</p>
      <p>We will contact you to proceed with the order soon.</p>
      <p>
        Quotation generated on: ${emailProp.quoteDate}.
      </p>
      <br />
      <hr style="color:black;">
      <div class="email__head-sub">
      <p><b>Our Aftersales Services cover the following:</b></p>
      <p>1. Lifetime FREE Labor Charges.</p>
      <p>2. 90 Days One to One Exchange.</p>
      <p>3. FREE On-Site Service / Repair within Klang Valley, Johor.</p>
      <p>4. Full Years Warranty Covered. Up to 10 Years.</p>
      <p>5. FREE Warranty Pick-Up and Return Covered Whole Malaysia.</p>
      <p>6. Lifetime Technical Support.</p>
      </div>
      <br />
    </div>
    <table class="email__table">
      <thead>
        <tr>
          <th class="email__table-head" style="width: 70%">
            <label htmlFor="product__label">
              <p>Product</p>
            </label>
          </th>
          <th class="email__table-head" style="width: 10%">
            <label htmlFor="quantity__label">
              <p>Price</p>
            </label>
          </th>
          <th class="email__table-head" style="width: 10%">
            <label htmlFor="quantity__label">
              <p>Quantity</p>
            </label>
          </th>
          <th class="email__table-head" style="width: 10%">
            <label htmlFor="total__label">
              <p>Total</p>
            </label>
          </th>
        </tr>
      </thead>
      <tbody>
      ` +
    emailHTMLRow +
    `
      </tbody>
      <tfoot>
        <tr>
          <td style="color: transparent">.</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>Price</td>
          <td>RM ${emailProp.oriPrice}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>Discount</td>
          <td>RM ${emailProp.discount}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td><b>Total Price</b></td>
          <td><b>RM ${emailProp.totalPrice}</b></td>
        </tr>
        <tr>
          <td style="color: transparent">.</td>
        </tr>
      </tfoot>
    </table>
    <br />
    <div style="text-align: center">
      <h2>Quotation Link</h2>
      <a href="${emailProp.link}">${emailProp.link}</a>
    </div>
    <br />
    <div style="text-align: center">
      <h2>Customer Information</h2>
      <p><b>Name: </b>${emailProp.name}</p>
      <p><b>Email: </b>${emailProp.email}</p>
      <p><b>Contact Number: </b>${emailProp.contact}</p>
      <p><b>State: </b>${emailProp.state}</p>
      <p><b>PC Usage: </b>${emailProp.reason}</p>
      <p><b>Other Requirements: </b>${emailProp.requirements}</p>
    </div>
    <br />
    <h2 style="text-align: center; margin-bottom: 0">Installment Options</h2>
    <p style="text-align: center; margin-top: 0; margin-bottom: 8px">(Walk-in Only)</p>
    <div
      class="email__install-main"
      style="
        display: flex;
        max-width: 400px;
        max-height: 400px;
        width: 100%;
        margin: 0 auto;
      "
    >
      <div
        class="email__install-left"
        style="
          border: solid;
          border-width: 1px;
          width: 100%;
          height: 100%;
          padding: 0 4px;
        "
      >
        <p><b>List of Bank</b></p>
        <p>Public Bank</p>
        <p>AEON Credit Card</p>
        <p>Affin Bank</p>
        <p>RHB Bank</p>
        <p>AMBANK</p>
        <p>HSBC</p>
        <p>Standard Chartered Bank</p>
        <p>Bank Simpanan Nasional</p>
        <p>OCBC</p>
        <p>UOB</p>
      </div>
      <div
        class="email__install-right"
        style="
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        "
      >
        <div
          style="
            border: solid;
            border-width: 1px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 4px;
          "
        >
          <p>Installment with <b>${emailProp.months} months</b> period</p>
        </div>
        <div
          style="
            border: solid;
            border-width: 1px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 4px;
          "
        >
          <p>Starting from <b>RM ${emailProp.monthly}/mo</b> with listed Bank</p>
        </div>
      </div>
    </div>
    <br />
  </body>
</html>
  `;

  interface FormValues {
    name: string;
    email: string;
    contact: string;
    state: string;
    reason: string;
    requirements: string;
    formData: string;
  }

  interface FormState {
    isLoading: boolean;
    values: FormValues;
    isSent: boolean;
  }

  const initialFormState: FormState = {
    isLoading: false,
    isSent: false,
    values: {
      name: "",
      email: "",
      contact: "",
      state: "",
      reason: "",
      requirements: "",
      formData: emailHTML,
    },
  };

  const [formValues, setFormValues] = useState<FormState>(initialFormState);

  const { values } = formValues;

  const formChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));

    setEmailProp({
      ...emailProp,
      [target.name]: target.value,
    });
  };

  const formAreaChange = ({
    target,
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));
    setEmailProp({
      ...emailProp,
      [target.name]: target.value,
    });
  };

  const formSelectChange = ({
    target,
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValues((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));
    setEmailProp({
      ...emailProp,
      [target.name]: target.value,
    });
  };

  const [invalidFormat, setInvalidFormat] = useState({
    email: true,
    contact: true,
  });
  const [invalidRequired, setInvalidRequired] = useState({
    name: false,
    email: false,
    contact: false,
    reason: false,
  });

  useEffect(() => {
    listPropDefine(listProp);
  }, [formData]);

  const pdfRef = useRef<HTMLDivElement>(null);
  const [downloadPDFVisual, setDownloadPDFVisual] = useState(false);

  const handlePDF = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setDownloadPDFVisual(true);

    const element = document.createElement("div");
    element.innerHTML = emailHTML;
    element.style.color = "black";
    document.body.appendChild(element);

    var opt = {
      margin: 8,
      image: { type: "jpeg", quality: 1 },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .save("IdealTechPC_Quote.pdf")
      .then(() => {
        document.body.removeChild(element);
      });
    setTimeout(() => {
      setDownloadPDFVisual(false);
    }, 1000);
  };

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    values.formData = emailHTML;

    setFormValues((prev) => ({
      ...prev,
      isLoading: true,
    }));

    // console.log(formValues, "onsubmit check");

    toast.promise(
      fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formValues.values),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then(() => {
        setTimeout(() => {
          setFormValues((prev) => ({
            ...prev,
            isLoading: false,
            values: {
              ...prev.values,
              name: "",
              email: "",
              contact: "",
              state: "",
              reason: "",
              requirements: "",
            },
          }));
          setEmailProp({
            ...emailProp,
            quoteDate: "date",
            oriPrice: 0,
            discount: 0,
            totalPrice: 0,
            months:
              quantityOption === 1
                ? 6
                : quantityOption === 2
                ? 12
                : quantityOption === 3
                ? 18
                : 0,
            monthly: 0,
            interest: 0,
            interestPerc: 0,
            totalInstall: 0,
            link: fullUrl,
            name: "",
            email: "",
            contact: "",
            state: "",
            reason: "",
            requirements: "",
          });
        }, 2000);
        setFormValues((prev) => ({
          ...prev,
          isSent: true,
        }));
        setTimeout(() => {
          setFormValues((prev) => ({
            ...prev,
            isSent: false,
          }));
        }, 1000);
      }),
      {
        loading: "Sending Email...",
        success: "Email Sent!",
        error: "Error Sending Email!",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh] text-center">
        <svg
          aria-hidden="true"
          className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-accent"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (formData.some((item) => item.id === quoteId) === false) {
    return (
      <h2 className="flex flex-col justify-center items-center h-[100vh] text-center text-red-400">
        Quote Does not Exists OR <br /> have been Deleted.
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
            formData.map((item) => {
              if (item.id === quoteId) {
                return new Date(item.createdAt).toLocaleString("en-GB", {
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
      <Offers />
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
            formData.map((item, index) => {
              if (item.id === quoteId) {
                const quoteData = item.formData;
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
          {formData.some((item) => item.id === quoteId) ? null : (
            <tr style={{ textAlign: "center" }}>Data Does Not Exists</tr>
          )}
        </tbody>
      </table>
      <div className="flex flex-col pt-16 gap-16 items-center mx-auto w-full">
        <div className="flex gap-16">
          <h2>
            Grand <br /> Total
          </h2>
          <div className="text-center">
            {formData &&
              quoteId &&
              formData.map((item) => {
                if (item.id === quoteId) {
                  return (
                    <p key={item.id}>
                      <b style={{ color: "gray", fontSize: 12 }}>
                        <s> RM {item.oriTotal}</s>
                      </b>
                      <br />
                      <b style={{ fontSize: 20 }}>RM {item.grandTotal}</b>
                      <br />
                      {item.grandTotal > 0 ? (
                        <b style={{ color: "#009BFF", fontSize: 12 }}>
                          Save RM {item.oriTotal - item.grandTotal}
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
        <div className="flex gap-4">
          <button
            className={`
            ${
              copySpecVisual
                ? "bg-green-600 text-white mobilehover:hover:bg-green-600/80"
                : "bg-secondary"
            }
          py-2 px-4   font-bold rounded-xl
          mobilehover:hover:bg-secondary/80 transition-all`}
            onClick={(event) => handleCopySpec(event)}
          >
            <p>{copySpecVisual ? "Copied!" : "Copy Specs"}</p>
          </button>
          <button
            className={`
            ${
              downloadPDFVisual
                ? "bg-green-600 text-white mobilehover:hover:bg-green-600/80"
                : "bg-secondary"
            }
          py-2 px-4   font-bold rounded-xl
          mobilehover:hover:bg-secondary/80 transition-all`}
            onClick={(event) => handlePDF(event)}
          >
            <p>{downloadPDFVisual ? "Downloading PDF..." : "Download PDF"}</p>
          </button>
        </div>
        <div className="flex gap-4 flex-col max-w-[340px] w-full text-center">
          <div>
            <h2>Installments Option</h2>
            <p>(Walk-in Only)</p>
          </div>
          <div className="flex gap-4 w-full relative">
            <select
              name="quantity__name"
              id="quantity__select"
              className="flex text-white w-full h-14 bg-accent sm:px-4 text-center appearance-none cursor-pointer rounded-2xl font-bold"
              defaultValue={1}
              style={{ textAlignLast: "center" }}
            >
              <option value={1}>Public Bank</option>
              <option value={2}>AEON Credit Card</option>
              <option value={3}>Affin Bank</option>
              <option value={4}>RHB Bank</option>
              <option value={5}>AMBANK</option>
              <option value={6}>HSBC</option>
              <option value={7}>Standard Chartered Bank</option>
              <option value={8}>Bank Simpanan Nasional</option>
              <option value={9}>OCBC</option>
              <option value={10}>UOB</option>
            </select>
            <RiArrowDropLeftFill
              size={40}
              className={`absolute top-[50%] sm:right-[0] right-2 sm:translate-y-[-50%] translate-y-[-0%] mt-[-20px] sm:mt-0 pointer-events-none 
              ${toggle ? "hidden" : ""}`}
            />
            <RiArrowDropDownFill
              size={40}
              className={`absolute top-[50%] sm:right-[0] right-2 sm:translate-y-[-50%] translate-y-[-0%] mt-[-20px] sm:mt-0 pointer-events-none 
              ${toggle ? "" : "hidden"}`}
            />
          </div>
          <div className="flex gap-4 sm:flex-row flex-col w-full mx-auto flex-wrap justify-center">
            <div className="flex gap-4 text-center">
              <div className="bg-secondary  rounded-2xl h-28 sm:w-40 w-full flex justify-center items-center flex-col">
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
              formData.map((item) => {
                if (item.id === quoteId) {
                  return (
                    <React.Fragment key={item.id}>
                      <div className="flex gap-4">
                        <div className="bg-secondary  rounded-2xl h-28 sm:w-40 w-full flex justify-center items-center flex-col">
                          <b style={{ fontSize: 12 }}>Starting from</b>
                          <b style={{ color: "#009BFF", fontSize: 20 }}>
                            RM{" "}
                            {Math.floor(
                              item.grandTotal /
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
                          <b style={{ fontSize: 12 }}>with listed Bank</b>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                }
                return null;
              })}
          </div>
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
      <form className="mx-auto w-[100%] max-w-[500px]">
        <div className="flex gap-4">
          <div className="flex-[4]">
            <label htmlFor="quotation__label">
              <p>Quotation Link</p>
            </label>
            <p>
              <input
                type="url"
                id="quotation__id"
                className=" bg-secondary py-2 px-4 w-full max-w-[500px] rounded-lg mt-2 mb-4"
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
              className={`
            mt-2 mb-8 py-2 w-full bg-accent rounded-xl font-bold
            mobilehover:hover:bg-accent/50 transition-all
            ${
              tooltipVisible
                ? "bg-green-600 mobilehover:hover:bg-green-600/50"
                : "bg-accent mobilehover:hover:bg-accent/50"
            }`}
              onClick={(event) => handleCopy(event)}
            >
              <p>{tooltipVisible ? "Copied!" : "Copy"}</p>
            </button>
          </div>
        </div>
        <label htmlFor="name__label">
          <p>
            Your Name <b style={{ color: "red" }}>*</b>
          </p>
        </label>
        <p>
          <input
            type="text"
            className={` bg-secondary py-2 px-4 w-full max-w-[500px] rounded-lg mt-2 mb-2 border-[3px]
            ${invalidRequired.name ? "border-red-500" : "border-transparent"}`}
            required
            name="name"
            value={values.name}
            onChange={formChange}
            onInput={(e) => {
              const input = e.currentTarget as HTMLInputElement;
              setInvalidRequired({
                ...invalidRequired,
                name: input.validity.valueMissing,
              });
            }}
          />
          <span
            className={`${invalidRequired.name ? "block" : "hidden"} mb-2`}
            style={{ fontSize: 12, color: "red" }}
          >
            Required
          </span>
        </p>
        <div className="flex gap-0 sm:gap-8 flex-col sm:flex-row">
          <div className="flex-[3]">
            <label htmlFor="email__label">
              <p>
                Your Email <b style={{ color: "red" }}>*</b>
              </p>
            </label>
            <p>
              <input
                type="email"
                className={` bg-secondary py-2 px-4 w-full max-w-[500px] rounded-lg mt-2 mb-2 border-[3px]
                ${
                  invalidFormat.email ? "border-transparent" : "border-red-500"
                }`}
                required
                name="email"
                value={values.email}
                onChange={formChange}
                onInput={(e) => {
                  const input = e.currentTarget as HTMLInputElement;
                  setInvalidFormat({
                    ...invalidFormat,
                    email: input.validity.valid,
                  });
                  setInvalidRequired({
                    ...invalidRequired,
                    email: input.validity.valueMissing,
                  });
                }}
              />
              <span
                className={`${
                  invalidRequired.email
                    ? "hidden"
                    : invalidFormat.email
                    ? "hidden"
                    : "block"
                } mb-2`}
                style={{ fontSize: 12, color: "red" }}
              >
                Invalid Email
              </span>
              <span
                className={`${invalidRequired.email ? "block" : "hidden"} mb-2`}
                style={{ fontSize: 12, color: "red" }}
              >
                Required
              </span>
            </p>
          </div>
          <div className="flex-[2]">
            <label htmlFor="contact__label">
              <p>
                Contact Number <b style={{ color: "red" }}>*</b>
              </p>
            </label>
            <p>
              <input
                type="tel"
                className={` bg-secondary py-2 px-4 w-full max-w-[500px] rounded-lg mt-2 mb-2 border-[3px]
                ${
                  invalidFormat.contact
                    ? "border-transparent"
                    : "border-red-500"
                }`}
                pattern="\+60-[0-9]{7,10}"
                required
                placeholder="+60-123456789"
                onInput={(e) => {
                  const input = e.currentTarget as HTMLInputElement;
                  input.setCustomValidity(
                    input.validity.patternMismatch
                      ? "Please enter a valid Malaysian phone number in the format: +60-123456789"
                      : ""
                  );
                  setInvalidFormat({
                    ...invalidFormat,
                    contact: input.validity.valid,
                  });
                  setInvalidRequired({
                    ...invalidRequired,
                    contact: input.validity.valueMissing,
                  });
                }}
                name="contact"
                value={values.contact}
                onChange={formChange}
              />
              <span
                className={`${
                  invalidRequired.contact
                    ? "hidden"
                    : invalidFormat.contact
                    ? "hidden"
                    : "block"
                } mb-2`}
                style={{ fontSize: 12, color: "red" }}
              >
                Valid format: +60-123456789
              </span>
              <span
                className={`${
                  invalidRequired.contact ? "block" : "hidden"
                } mb-2`}
                style={{ fontSize: 12, color: "red" }}
              >
                Required
              </span>
            </p>
          </div>
        </div>
        <label htmlFor="state__label">
          <p>
            Which state are you from? <b style={{ color: "red" }}>*</b>
          </p>
        </label>
        <div className="relative">
          <p>
            <select
              id="state__id"
              className=" bg-secondary py-2 px-4 w-full max-w-[500px] rounded-lg mt-2 mb-2 appearance-none cursor-pointer"
              onClick={() => {
                setToggle(!toggle);
              }}
              required
              name="state"
              onChange={formSelectChange}
              defaultValue="notSelected"
            >
              <option
                value="notSelected"
                className="font-bold "
              >{`Choose your state here`}</option>
              {State.getStatesOfCountry("MY").map((option, optionIndex) => {
                return (
                  <option key={optionIndex} value={option.name}>
                    {option.name}
                  </option>
                );
              })}
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
          <p>
            What are you using the PC for? <b style={{ color: "red" }}>*</b>
          </p>
        </label>
        <p>
          <textarea
            id="reason__id"
            rows={2}
            className={` bg-secondary py-2 px-4 w-full max-w-[500px] rounded-lg mt-2 mb-2 border-[3px]
            ${
              invalidRequired.reason ? "border-red-500" : "border-transparent"
            }`}
            required
            name="reason"
            value={values.reason}
            onChange={formAreaChange}
            onInput={(e) => {
              const input = e.currentTarget as HTMLTextAreaElement;
              setInvalidRequired({
                ...invalidRequired,
                reason: input.validity.valueMissing,
              });
            }}
          />
          <span
            className={`${invalidRequired.reason ? "block" : "hidden"} mb-2`}
            style={{ fontSize: 12, color: "red" }}
          >
            Required
          </span>
        </p>
        <label htmlFor="requirements__label">
          <p>Any other requirements you would like?</p>
        </label>
        <p>
          <textarea
            id="requirements__id"
            rows={2}
            className=" bg-secondary py-2 px-4 w-full max-w-[500px] rounded-lg mt-2 mb-4"
            name="requirements"
            value={values.requirements}
            onChange={formAreaChange}
          />
        </p>
        <div className="flex justify-around items-center">
          <Link href={"/"}>
            <button
              className="
            py-2 px-4 bg-secondary  font-bold rounded-xl
            mobilehover:hover:bg-secondary/80 transition-all"
            >
              <p>Back</p>
            </button>
          </Link>
          <button
            className={`
            py-2 px-4 bg-accent text- font-bold rounded-xl border-transparent
          mobilehover:hover:bg-accent/50 transition-all
          ${formValues.isLoading ? "bg-green-600" : ""}
          ${
            values.name ||
            values.email ||
            values.contact ||
            values.state ||
            values.reason
              ? "mobilehover:hover:bg-accent/50"
              : "mobilehover:hover:bg-red-500/50"
          }`}
            disabled={
              !values.name ||
              !values.email ||
              !values.contact ||
              !values.state ||
              !values.reason
            }
            onClick={onSubmit}
          >
            <p>
              {formValues.isLoading
                ? "Submitting.."
                : formValues.isSent
                ? "Submitted!"
                : "Submit"}
            </p>
          </button>
        </div>
      </form>
    </div>
  );
}

export default QuotePage;
