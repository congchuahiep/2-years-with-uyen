import "server-only";

import * as v from "valibot";
import {
  DeezerSearchResultSchema,
  type DeezerTrack,
} from "./resources/deezer-track";
import { deezerApi } from "./services/deezer-api";
import { deezerEndpoint } from "./services/deezer-endpoint";

/** Tìm track trên Deezer từ server để tránh CORS. */
export async function searchDeezer(query: string): Promise<DeezerTrack[]> {
  const response = await deezerApi.get(deezerEndpoint.search(query));
  return v.parse(DeezerSearchResultSchema, response.data).data;
}

/**
 * Proxy một endpoint bất kỳ của Deezer (track, artist, ...).
 *
 * Trả nguyên JSON vì chưa có resource tương ứng cho mọi endpoint; route
 * handler chịu trách nhiệm chuyển tiếp.
 */
export async function fetchDeezer(
  path: string[],
  search: string,
): Promise<unknown> {
  const joined = path.join("/");
  const response = await deezerApi.get(`/${joined}${search}`);
  return response.data;
}
