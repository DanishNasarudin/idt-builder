import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import html2pdf from "html2pdf.js";
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

export const createPDF = (template: string) => {
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
