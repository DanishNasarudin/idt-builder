"use server";
import fs from "fs/promises";
import path from "path";

export type ProductType = {
  product_id: number;
  product_name: string;
  ori_price: number;
  dis_price: number;
  is_discounted: boolean;
  is_label: boolean;
};

export type CategoryType = {
  category_id: number;
  category_name: string;
  products: ProductType[];
};

function TxtToProduct(txtContent: string): CategoryType {
  const lines = txtContent.trim().split("\n");
  const category: CategoryType = {
    category_id: 0,
    category_name: "",
    products: [],
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.endsWith(":")) {
      category.products.push({
        product_id: i,
        product_name: line.slice(0, -1),
        ori_price: 0,
        dis_price: 0,
        is_discounted: false,
        is_label: true,
      });

      i++;

      while (i < lines.length && lines[i].includes(",")) {
        const [product_name, dis_price, ori_price] = lines[i]
          .split(",")
          .map((s) => s.trim());

        category.products.push({
          product_id: i,
          product_name,
          ori_price: Number(ori_price),
          dis_price: Number(dis_price),
          is_discounted:
            Number(ori_price) - Number(dis_price) > 0 ? true : false,
          is_label: false,
        });

        i++;
      }
    } else {
      // Brands with no options or just standalone lines
      if (!lines.includes(",")) {
        category.products.push({
          product_id: i,
          product_name: line,
          ori_price: 0,
          dis_price: 0,
          is_discounted: false,
          is_label: true,
        });
        i++;
      } else {
        i++;
      }
    }
  }

  return category;
}

export async function getAllPriceList(): Promise<CategoryType[]> {
  const pricelistDir = "pricelist";
  const files = await fs.readdir(pricelistDir);
  const allProducts: CategoryType[] = [];

  let i = 0;
  for (const file of files) {
    if (path.extname(file) === ".txt") {
      const filePath = path.join(pricelistDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      const category = path.basename(file, ".txt"); // Getting the file name without extension
      const products = TxtToProduct(content);

      products.category_id = i;
      products.category_name = category; // Setting the category based on file name
      allProducts.push(products);
      i++;
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
