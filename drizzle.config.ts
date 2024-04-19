import { config } from "dotenv";
import { Config } from "drizzle-kit";

if (process.env.NODE_ENV === "production") {
  // console.log("Running Production Mode.");
  config({ path: ".prod.env" });
} else {
  // console.log("Running Development Mode.");
  config({ path: ".dev.env" });
}

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DB_URL!,
  },
} satisfies Config;
