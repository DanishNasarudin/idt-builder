import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
// import html2pdf from "html2pdf.js";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createURL = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramString = params.toString();
  const queryString = `${paramString.length ? `?` : ""}${paramString}`;

  return `${pathname}${queryString}`;
};

export const createPDF = async (template: string) => {
  const html2pdf = await require("html2pdf.js");
  const element = document.createElement("div");
  element.innerHTML = template;
  element.style.color = "black";
  document.body.appendChild(element);

  var opt = {
    margin: 8,
    image: { type: "jpeg", quality: 1 },
  };

  const today = new Date();
  const formattedDate = format(today, "yyyyMMdd");

  html2pdf()
    .from(element)
    .set(opt)
    .toPdf()
    .save(`${formattedDate}_IdealTechPC_Quote.pdf`)
    .then(() => {
      document.body.removeChild(element);
    });
};

export const containsSearchTerm = (value: any, searchTerm: string): boolean => {
  if (typeof value === "string") {
    const terms = searchTerm.split(" ");

    return terms.every((term) =>
      value.toLowerCase().includes(term.toLowerCase())
    );
  } else if (Array.isArray(value)) {
    return value.some((item) => containsSearchTerm(item, searchTerm));
  } else if (typeof value === "object" && value !== null) {
    return Object.values(value).some((innerValue) =>
      containsSearchTerm(innerValue, searchTerm)
    );
  }
  return false;
};
