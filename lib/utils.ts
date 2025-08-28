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

export const getCategory = (name: string) => {
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
