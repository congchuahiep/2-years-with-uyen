import * as v from "valibot";

/**
 * Nghệ sĩ Deezer trả kèm track. Chỉ giữ các trường UI đang dùng.
 */
export const DeezerArtistSchema = v.object({
  id: v.number(),
  name: v.string(),
  picture_small: v.string(),
});

/**
 * Album Deezer trả kèm track. Ảnh `cover_small`/`cover_medium` là URL.
 */
export const DeezerAlbumSchema = v.object({
  id: v.number(),
  title: v.string(),
  cover_small: v.string(),
  cover_medium: v.string(),
});

/**
 * Một bài hát Deezer (`/search`, `/track/{id}`).
 * Trường giữ đúng snake_case của API để không phải map lại.
 */
export const DeezerTrackSchema = v.object({
  id: v.number(),
  title: v.string(),
  link: v.string(),
  /** URL preview mp3, có thể rỗng với bài không cho nghe thử. */
  preview: v.string(),
  artist: DeezerArtistSchema,
  album: DeezerAlbumSchema,
});

/**
 * Kết quả tìm kiếm Deezer. Deezer trả `data` rỗng khi không khớp bài nào.
 */
export const DeezerSearchResultSchema = v.object({
  data: v.optional(v.array(DeezerTrackSchema), []),
});

export type DeezerArtist = v.InferOutput<typeof DeezerArtistSchema>;

export type DeezerAlbum = v.InferOutput<typeof DeezerAlbumSchema>;

export type DeezerTrack = v.InferOutput<typeof DeezerTrackSchema>;

export type DeezerSearchResult = v.InferOutput<typeof DeezerSearchResultSchema>;
