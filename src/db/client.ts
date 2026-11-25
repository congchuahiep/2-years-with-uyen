import "server-only";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { getEnv } from "@/configs/env";
import * as schema from "./schema";

let database: ReturnType<typeof createDatabase> | undefined;

function createDatabase() {
  const env = getEnv();
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

/**
 * Kết nối lazy: không đọc env lúc build, chỉ mở khi có request đầu tiên.
 */
export function getDb() {
  database ??= createDatabase();
  return database;
}
