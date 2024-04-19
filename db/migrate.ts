import { config } from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import * as schema from "./schema";

if (process.env.NODE_ENV === "production") {
  // console.log("Running Production Mode.");
  config({ path: ".prod.env" });
} else {
  // console.log("Running Development Mode.");
  config({ path: ".dev.env" });
}

const main = async () => {
  const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

  if (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME) return;

  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    connectionLimit: 1,
    port: 3306,
  });

  const db = drizzle(connection, { schema, mode: "default" });

  try {
    await migrate(db, { migrationsFolder: "./db/migrations" });
    await connection.end();
    console.log("Migration Successfull.");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};
main();
