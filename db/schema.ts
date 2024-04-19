import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  int,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const product_category = mysqlTable("product_category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }),
  sort_val: int("sort_val").notNull(),
});

export const productCategoryRelations = relations(
  product_category,
  ({ many }) => ({
    product: many(product),
  }),
);

export const product = mysqlTable("product", {
  id: serial("id").primaryKey(),
  product_name: varchar("product_name", { length: 200 }),
  ori_price: int("ori_price"),
  dis_price: int("dis_price"),
  is_available: boolean("is_available").default(true),
  is_label: boolean("is_label").default(false),
  is_soldout: boolean("is_soldout").default(false).notNull(),
  category_id: bigint("category_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => product_category.id),
  sort_val: int("sort_val").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(
    sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
  ),
});

export type Product = typeof product.$inferSelect;

export const productRelations = relations(product, ({ one }) => ({
  category: one(product_category, {
    fields: [product.category_id],
    references: [product_category.id],
  }),
}));

export const simple_products = mysqlTable("simple_products", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 200 }),
  product_list: text("product_list"),
});

export const quotes = mysqlTable("quotes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  quote_data: json("quote_data"),
});

export type Quotes = typeof quotes.$inferInsert;
export type QuotesSelect = typeof quotes.$inferSelect;
