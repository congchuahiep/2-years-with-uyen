import * as v from "valibot";
import {
  DeezerSearchResultSchema,
  type DeezerTrack,
} from "../resources/deezer-track";

/**
 * Tìm bài hát qua route nội bộ `/api/music/search`.
 *
 * Client dùng `fetch` thay vì axios để không phải tải axios; response vẫn
 * được validate bằng resource schema như khi server đọc Deezer.
 */
export async function searchDeezerTracks(
  query: string,
): Promise<DeezerTrack[]> {
  const response = await fetch(
    `/api/music/search?q=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error("Không tìm được bài hát trên Deezer");
  }

  return v.parse(DeezerSearchResultSchema, await response.json()).data;
}
