import { AdminBodyProductType } from "@/app/admin/(admin-components)/AdminBodyShcn";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import html2pdf from "html2pdf.js";
import { ReadonlyURLSearchParams } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const customFilter = (textValue: string, inputValue: string) => {
  // console.log(textValue, inputValue);

  if (Boolean(inputValue)) {
    const terms = inputValue.split(" ");

    return terms.every((term) =>
      textValue.toLowerCase().includes(term.toLowerCase()),
    );
  }

  return true;
};

export function debounceFunc<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export const createURL = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramString = params.toString();
  const queryString = `${paramString.length ? `?` : ""}${paramString}`;

  return `${pathname}${queryString}`;
};

export const containsSearchTerm = (value: any, searchTerm: string): boolean => {
  if (typeof value === "string") {
    const terms = searchTerm.split(" ");

    return terms.every((term) =>
      value.toLowerCase().includes(term.toLowerCase()),
    );
  } else if (Array.isArray(value)) {
    return value.some((item) => containsSearchTerm(item, searchTerm));
  } else if (typeof value === "object" && value !== null) {
    return Object.values(value).some((innerValue) =>
      containsSearchTerm(innerValue, searchTerm),
    );
  }
  return false;
};

export const createPDF = (template: string) => {
  // Open a new window
  // const newWindow = window.open("", "_blank");
  // if (newWindow) {
  //   // Write the HTML string to the new window
  //   newWindow.document.write(template);

  //   // Wait for the new window's content to fully load
  //   newWindow.document.close();
  //   newWindow.onload = async () => {
  //     // Render the new window's content to canvas
  //     const canvas = await html2canvas(
  //       newWindow.document.body.firstElementChild as HTMLElement
  //     );

  //     // Initialize jsPDF
  //     const pdf = new jsPDF("p", "pt", "a4");

  //     // Calculate the aspect ratio of the canvas
  //     const canvasAspectRatio = canvas.height / canvas.width;
  //     const a4AspectRatio =
  //       pdf.internal.pageSize.height / pdf.internal.pageSize.width;
  //     let pdfWidth = pdf.internal.pageSize.width;
  //     let pdfHeight = pdf.internal.pageSize.height;

  //     // Adjust dimensions if canvas aspect ratio is less than A4 aspect ratio
  //     if (canvasAspectRatio < a4AspectRatio) {
  //       pdfHeight = pdfWidth * canvasAspectRatio;
  //     } else {
  //       pdfWidth = pdfHeight / canvasAspectRatio;
  //     }

  //     // Convert canvas to image data
  //     const imgData = canvas.toDataURL("image/png");

  //     // Add the image to the PDF, fit to page
  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  //     const today = new Date();
  //     const formattedDate = format(today, "yyyyMMdd");

  //     // Save the PDF
  //     pdf.save(${formattedDate}_IdealTechPC_Quote.pdf);

  //     // Close the new window
  //     newWindow.close();
  //   };
  // } else {
  //   console.error("Failed to open a new window");
  // }
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

export function deepCopy<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj; // Return the value if obj is not an object
  }

  // Create an array or object to hold the values
  let copy: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const val = (obj as any)[key];

    // Recursively copy for nested objects, including arrays
    copy[key] = typeof val === "object" ? deepCopy(val) : val;
  }

  return copy as T;
}

export const sortProducts = (products: AdminBodyProductType) => {
  const sortedAndResolved = products
    .slice()
    .sort((a, b) => {
      // First, sort by 'sort_val' ascending
      const sortValDifference = a.sort_val - b.sort_val;
      if (sortValDifference === 0) {
        return b.id - a.id; // Larger 'id' first if 'sort_val' is the same
      }
      return sortValDifference;
    })
    .map((product, index) => ({
      ...product,
      sort_val: index + 1,
    }));
  return sortedAndResolved;
};

export const useWindowResize = () => {
  const [size, setSize] = React.useState([0, 0]);

  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
};
