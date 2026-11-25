import "server-only";

import axios from "axios";

/**
 * axios instance gọi Deezer, CHỈ dùng ở server.
 *
 * Client không import file này: mọi request từ trình duyệt đi qua
 * `/api/music/*` của mình, nhờ vậy axios không lọt vào bundle.
 */
export const deezerApi = axios.create({
  baseURL: "https://api.deezer.com",
  headers: { "Content-Type": "application/json" },
});
