"use server";
import { db } from "@/db/db";
import { product, product_category } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { AdminBodyProductType } from "../admin/(admin-components)/AdminBodyShcn";
import { AdminCatProps } from "../admin/(admin-components)/AdminHead";

async function adminInsertCategory(name: string, sort_val: number) {
  try {
    await db
      .insert(product_category)
      .values({ name: name, sort_val: sort_val });
    revalidatePath("/admin");
    return true;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

async function adminDelCategory(id: number) {
  try {
    await db.delete(product_category).where(eq(product_category.id, id));
    revalidatePath("/admin");
    return true;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

async function adminUpdateCategory(updatedItems: AdminCatProps) {
  try {
    for (const item of updatedItems) {
      await db
        .update(product_category)
        .set({ name: item?.name })
        .where(eq(product_category.id, Number(item?.db_id)));
      await db
        .update(product_category)
        .set({ sort_val: item?.id })
        .where(eq(product_category.id, Number(item?.db_id)));
    }
    revalidatePath("/admin");
    return true;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

async function adminInsertListing(
  category_id: bigint,
  sort_val: number,
  name: string,
) {
  try {
    await db.insert(product).values({
      category_id: category_id,
      sort_val: sort_val,
      product_name: name,
      is_soldout: false,
    });
    // revalidatePath("/admin");
    const id: any = await db.execute(sql`select LAST_INSERT_ID() as id`);
    return id[0][0].id;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

async function adminInsertListingBulk(
  category_id: bigint,
  sort_val: number,
  data: string,
) {
  try {
    const convertToObj = (input: string) => {
      const productLines: string[] = input.split("\n");
      let sortVal = sort_val - 1;

      return productLines.map((line) => {
        if (line.trim().length === 0) {
          return {
            sort_val: ++sortVal,
            product_name: "",
            ori_price: null,
            dis_price: null,
            is_available: true,
            is_label: true,
            is_soldout: false,
          };
        }

        if (!line.trim().endsWith(":") && !line.trim().includes(",")) {
          return {
            sort_val: ++sortVal,
            product_name: "",
            ori_price: null,
            dis_price: null,
            is_available: true,
            is_label: true,
            is_soldout: false,
          };
        }

        if (line.trim().endsWith(":") && !line.trim().includes(",")) {
          const parts = line.split(":").map((part) => part.trim());
          const product_name = parts[0];
          return {
            sort_val: ++sortVal,
            product_name,
            ori_price: null,
            dis_price: null,
            is_available: true,
            is_label: true,
            is_soldout: false,
          };
        }

        const parts = line.split(",").map((part) => part.trim());
        const product_name = parts[0];
        const ori_price =
          parseInt(parts[1], 10) - parseInt(parts[2], 10) < 0
            ? parseInt(parts[2], 10)
            : parseInt(parts[1], 10);
        // Check if a third part (discount) exists and is a valid number
        const dis_price =
          parts.length > 2
            ? parseInt(parts[1], 10) - parseInt(parts[2], 10) < 0
              ? parseInt(parts[1], 10)
              : parseInt(parts[2], 10)
            : null;

        return {
          sort_val: ++sortVal,
          product_name,
          ori_price,
          dis_price:
            dis_price !== null
              ? ori_price - dis_price > 0
                ? dis_price
                : null
              : null,
          is_available: true,
          is_label: false,
          is_soldout: false,
        };
      });
    };

    // console.log(convertToObj(data));
    const productReady = convertToObj(data);

    // console.log(productReady);

    for (const item of productReady) {
      await db.insert(product).values({
        category_id,
        sort_val,
        product_name: item.product_name,
        ori_price: item.ori_price,
        dis_price: item.dis_price,
        is_label: item.is_label,
        is_soldout: false,
      });
    }

    // await db.insert(product).values({
    //   category_id: category_id,
    //   sort_val: sort_val,
    //   product_name: product_name,
    // });
    // revalidatePath("/admin");
    const id: any = await db.execute(sql`select LAST_INSERT_ID() as id`);

    // return id[0][0].id;
    let idAdd = id[0][0].id + 1;
    return productReady.reverse().map((item) => {
      return { id: --idAdd, ...item };
    });
  } catch (error: any) {
    throw new Error(`${error.message}, Check: ${error.sql}`);
  }
}

async function adminUpdateListing(updatedItems: AdminBodyProductType) {
  try {
    const updateProduct = db
      .update(product)
      .set({
        dis_price: sql.placeholder("dis_price").getSQL(),
        is_available: sql.placeholder("is_available").getSQL(),
        is_label: sql.placeholder("is_label").getSQL(),
        ori_price: sql.placeholder("ori_price").getSQL(),
        product_name: sql.placeholder("product_name").getSQL(),
        sort_val: sql.placeholder("sort_val").getSQL(),
        is_soldout: sql.placeholder("is_soldout").getSQL(),
      })
      .where(eq(product.id, sql.placeholder("id")))
      .prepare();

    for (const item of updatedItems) {
      await updateProduct.execute({
        dis_price: item?.dis_price,
        is_available: item?.is_available,
        is_label: item?.is_label,
        ori_price: item?.ori_price,
        product_name: item?.product_name,
        sort_val: item?.sort_val,
        is_soldout: item?.is_soldout,
        id: Number(item?.id),
      });
    }
    revalidatePath("/admin");
    // console.log("pass");
    return true;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

async function adminDelListing(id: number) {
  try {
    await db.delete(product).where(eq(product.id, id));
    // if (revalidate) revalidatePath("/admin");
    return true;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

async function adminDelListingBulk(ids: number[], revalidate: boolean = false) {
  try {
    await db.execute(sql`DELETE FROM ${product} WHERE ${product.id} IN ${ids}`);
    if (revalidate) revalidatePath("/admin");
    return true;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

async function adminReplaceData(
  catId: number,
  updatedItems: AdminBodyProductType,
) {
  try {
    await db.delete(product).where(eq(product.category_id, BigInt(catId)));
    for (const item of updatedItems) {
      await db.insert(product).values({
        category_id: BigInt(catId),
        sort_val: item.sort_val,
        product_name: item.product_name,
        ori_price: item.ori_price,
        dis_price: item.dis_price,
        is_label: item.is_label,
        is_available: item.is_available,
      });
    }
    revalidatePath("/admin");
    return true;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

export {
  adminDelCategory,
  adminDelListing,
  adminDelListingBulk,
  adminInsertCategory,
  adminInsertListing,
  adminInsertListingBulk,
  adminReplaceData,
  adminUpdateCategory,
  adminUpdateListing,
};
