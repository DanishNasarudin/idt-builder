import { config } from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

if (process.env.NODE_ENV === "production") {
  console.log("DB Running Production Mode.");
  config({ path: ".prod.env" });
} else {
  console.log("DB Running Development Mode.");
  config({ path: ".dev.env" });
}

// const dbInitPromise: Promise<MySql2Database<typeof schema>> =
//   (async (): Promise<MySql2Database<typeof schema>> => {
//     const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;
//     const connection = await mysql.createConnection({
//       host: DB_HOST,
//       user: DB_USER,
//       password: DB_PASS,
//       database: DB_NAME,
//     });
//     return drizzle(connection, { schema, mode: "default" });
//   })();

// const dbProxy = new Proxy({} as MySql2Database<typeof schema>, {
//   get: (target, propertyKey: PropertyKey) => {
//     if (typeof propertyKey !== "string") {
//       throw new Error("Property key is not a string");
//     }
//     return async (...args: any[]) => {
//       const db = await dbInitPromise;
//       const prop = (db as any)[propertyKey];
//       if (typeof prop === "function") {
//         return prop.apply(db, args);
//       }
//       throw new Error(`Property ${propertyKey} is not a function`);
//     };
//   },
// });

// export { dbProxy as db };

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

const connection = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  connectionLimit: 5000,
});
const db = drizzle(connection, { schema, mode: "default" });

export { db };
