"use server";

import { db } from "@/db/db";
import { product, quotes } from "@/db/schema";
import { sql } from "drizzle-orm";
import fs from "fs/promises";

async function drizzleInsert(textData: string, category: string) {
  const sections = textData.split("\n\n");
  let categoryId = Number(category);

  for (const section of sections) {
    const lines = section.split("\n");
    const title = lines[0];
    await insertLabelWithDrizzle(title, categoryId);

    let productValues = [];

    for (const line of lines.slice(1)) {
      if (line.endsWith(":") && !line.includes(",")) {
        await insertLabelWithDrizzle(line, categoryId);
        // console.log(line, "label inside");

        if (productValues.length > 0) {
          // console.log(productValues, "inside");
          const insertQuery = sql`
        INSERT INTO product (product_name, ori_price, dis_price, category_id)
        VALUES ${sql.raw(productValues.join(", "))};
      `;
          await db.execute(insertQuery);
          productValues = [];
        }
      } else if (line.includes(",") && !line.endsWith(":")) {
        const [name, disPrice, oriPrice] = line
          .split(",")
          .map((value) => value.trim());
        const checkDis = disPrice === oriPrice ? null : disPrice;
        productValues.push(
          `('${name}', ${oriPrice}, ${checkDis}, ${categoryId})`
        );
      }
    }

    if (productValues.length > 0) {
      // console.log(productValues, "outside");
      const insertQuery = sql`
    INSERT INTO product (product_name, ori_price, dis_price, category_id)
    VALUES ${sql.raw(productValues.join(", "))};
  `;
      await db.execute(insertQuery);
    }
  }
}

async function insertLabelWithDrizzle(label: string, categoryId: number) {
  const insertLabelQuery = sql`
        INSERT INTO product (product_name, is_label, category_id)
        VALUES (${label}, true, ${categoryId});
    `;
  await db.execute(insertLabelQuery);
}

async function drizzleSearch(
  searchParam: string
): Promise<(typeof product.$inferSelect)[]> {
  const query = await db.select().from(product);

  const result = query.filter((data) => {
    const terms = searchParam.split(" ");
    // console.log(terms);
    return terms.every((term) => {
      if (data.product_name === null) return false;
      return data.product_name.toLowerCase().includes(term.toLowerCase());
    });
  });

  // console.log(result);

  return result.splice(0, 30);
}

async function drizzleInsertQuote(id: string, json: string) {
  // console.log("pass", id, json);
  await db.insert(quotes).values({ id: id, quote_data: json });
}

async function drizzlePullQuote(id: string): Promise<string | null> {
  const query = await db.query.quotes.findMany({
    where: (quotes, { eq }) => eq(quotes.id, id),
  });
  return query[0] ? (query[0].quote_data as string) : null;
}

async function drizzleInsertQuoteCustom(file: any) {
  const rawData = await fs.readFile(file);
  // const data = JSON.parse(rawData);

  // const idValue = data.id;

  // const jsonValue = JSON.stringify(data);
}

export { drizzleInsert, drizzleInsertQuote, drizzlePullQuote, drizzleSearch };
