"use server";
import fs from "fs/promises";
import path from "path";

export type OptionType = {
  name: string;
  oriPrice: number;
  price: number;
};

export type BrandType = {
  name: string;
  options: OptionType[];
};

export type ProductType = {
  category: string;
  brands: BrandType[];
};

function TxtToProduct(txtContent: string): ProductType {
  const lines = txtContent.trim().split("\n");
  const products: ProductType = {
    category: "CPU", // This can be dynamic based on the file name if needed
    brands: [],
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Detect brand names without options using the colon at the end
    if (line.endsWith(":")) {
      const brand: BrandType = {
        name: line.slice(0, -1), // Removing the colon
        options: [],
      };
      i++;

      // Extract options for the brand
      while (i < lines.length && lines[i].includes(",")) {
        const [optionName, priceStr, priceOri] = lines[i]
          .split(",")
          .map((s) => s.trim());
        brand.options.push({
          name: optionName,
          oriPrice: parseInt(priceOri, 10),
          price: parseInt(priceStr, 10),
        });
        i++;
      }
      // console.log(brand, "T2");

      products.brands.push(brand);
    } else {
      // Brands with no options or just standalone lines
      if (!lines[i].includes(",")) {
        products.brands.push({
          name: line,
          options: [],
        });
        i++;
      } else {
        // If a line with a comma is detected outside of a brand section, we'll skip it.
        i++;
      }
    }
  }

  return products;
}

export async function getAllPriceList(): Promise<ProductType[]> {
  const pricelistDir = "pricelist";
  const files = await fs.readdir(pricelistDir);
  const allProducts: ProductType[] = [];

  for (const file of files) {
    if (path.extname(file) === ".txt") {
      const filePath = path.join(pricelistDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      const category = path.basename(file, ".txt"); // Getting the file name without extension
      const products = TxtToProduct(content);

      products.category = category; // Setting the category based on file name
      allProducts.push(products);
    }
  }
  return allProducts;
}

export async function getAllTextFilePaths(): Promise<string[]> {
  const dirPath = path.join(process.cwd(), "pricelist");
  const files = await fs.readdir(dirPath);

  return files
    .filter((file) => file.endsWith(".txt"))
    .map((file) => path.join(dirPath, file));
}

export async function getLatestUpdatedTimestamp(): Promise<Date | null> {
  try {
    const filePaths = await getAllTextFilePaths();

    // Return null if there are no .txt files
    if (filePaths.length === 0) {
      return null;
    }

    // Get modification times of all .txt files
    const fileModTimes = await Promise.all(
      filePaths.map(async (filePath) => {
        const stats = await fs.stat(filePath);
        return stats.mtime; // Return the modification time
      })
    );

    // Find the latest modification time
    const latestModTime = fileModTimes.reduce((latest, current) =>
      current > latest ? current : latest
    );

    return latestModTime;
  } catch (error) {
    console.error("Error getting latest updated timestamp:", error);
    throw error; // Handle error as needed
  }
}
