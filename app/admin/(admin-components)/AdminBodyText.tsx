"use client";
import { adminReplaceData } from "@/app/(serverActions)/adminActions";
import { Button, Textarea } from "@nextui-org/react";
import React from "react";
import { AdminBodyProductType, AdminBodyType } from "./AdminBodyShcn";

type Props = { content: AdminBodyType };

function mapProductsToTextarea(products: AdminBodyProductType): string {
  return products
    .map(
      (product) =>
        `${product.product_name}, ${product.ori_price}, ${product.dis_price}`,
    )
    .join("\n");
}

function parseTextareaToProducts(
  textareaContent: string,
  originalProducts: AdminBodyProductType,
): AdminBodyProductType {
  const lines = textareaContent.split("\n");
  return lines.map((line, index) => {
    const [product_name, ori_price, dis_price] = line
      .split(", ")
      .map((item) => item.trim());

    const originalProduct = originalProducts.find(
      (product) => product.product_name === product_name,
    );
    return {
      id: originalProduct ? originalProduct.id : -1, // Assuming -1 as default if not found
      sort_val:
        originalProduct?.sort_val === index ? originalProduct.sort_val : index, // Default sort_val
      product_name: product_name,
      ori_price: ori_price
        ? ori_price !== "null"
          ? parseFloat(ori_price)
          : null
        : null,
      dis_price: dis_price
        ? dis_price !== "null"
          ? parseFloat(dis_price)
          : null
        : null,
      is_available: originalProduct ? originalProduct.is_available : null, // Default is_available
      is_label: originalProduct ? originalProduct.is_label : null, // Default is_label
      is_soldout: originalProduct ? originalProduct.is_soldout : false,
    };
  });
}

const AdminBodyText = ({ content }: Props) => {
  const [value, setValue] = React.useState("");

  const insertDB = async () => {
    const newProduct = parseTextareaToProducts(value, content.product);

    // const checkIfDeleted = newProduct.length - content.product.length;

    //   console.log(checkIfDeleted === 0 ? "" : "Error DONT DELETE PRODUCT");
    //   if (checkIfDeleted === 0) {
    //       console.error("Error: Dont delete ")
    //   }
    adminReplaceData(content.id, newProduct);

    console.log(newProduct);
  };

  React.useEffect(() => {
    setValue(mapProductsToTextarea(content.product));
  }, [content]);

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => insertDB()}>Update</Button>
      <Textarea
        // style={{ height: "500px" }}
        minRows={100}
        maxRows={100}
        // classNames={{
        //   input: "!h-[600px]",
        //   inputWrapper: "!h-max",
        //   innerWrapper: "!h-max",
        // }}
        // disableAutosize
        value={value}
        onValueChange={(e) => setValue(e)}
      />
    </div>
  );
};

export default AdminBodyText;
