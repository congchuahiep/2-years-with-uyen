import "server-only";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { getEnv, getOptionalEnv } from "@/configs/env";
import * as schema from "./schema";

let database: ReturnType<typeof createDatabase> | undefined;

function createDatabase() {
	const client = createClient({
		url: getEnv("DATABASE_URL"),
		authToken: getOptionalEnv("DATABASE_AUTH_TOKEN"),
	});
	return drizzle(client, { schema });
}

/** Kết nối lazy: không đọc env lúc build, chỉ mở khi có request đầu tiên. */
export function getDb() {
	database ??= createDatabase();
	return database;
}
