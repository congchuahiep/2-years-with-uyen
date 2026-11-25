# Feature music

Tìm bài hát trên Deezer và phát preview. Chưa được route tới, mới có component và đường gọi API.

## Khái niệm

- **DeezerTrack**: resource của một bài hát, giữ đúng snake_case của Deezer để không phải viết mapper.
- **Proxy nội bộ**: client không gọi Deezer trực tiếp (CORS, và không muốn mang API key/axios vào bundle). Client gọi `/api/music/search`, route handler gọi `server.ts`, `server.ts` gọi Deezer.
- **Hai đường HTTP**: axios chỉ ở server (`services/deezer-api.ts`), `fetch` ở client (`services/deezer-search.ts`).

## Luồng tìm kiếm

```text
MusicSearchBox (client)
  -> searchDeezerTracks(query)             services/deezer-search.ts
  -> GET /api/music/search?q=...           app/api/music/search/route.ts
  -> searchDeezer(query)                   features/music/server.ts
  -> deezerApi.get(...)                    services/deezer-api.ts
  -> v.parse(DeezerSearchResultSchema, ...)
```

Response được validate ở hai biên: `server.ts` khi đọc Deezer, `deezer-search.ts` khi đọc route nội bộ. Nhờ vậy đổi shape API không lọt vào UI.

## File và API

| File | Export | Ghi chú |
|---|---|---|
| `components/MusicSearchBox.tsx` | default `MusicSearchBox` | client, debounce 500ms, điều hướng bằng bàn phím |
| `resources/deezer-track.ts` | schemas + type `DeezerTrack` | nguồn sự thật của shape Deezer |
| `services/deezer-search.ts` | `searchDeezerTracks` | client `fetch`, validate response |
| `services/deezer-api.ts` | `deezerApi` | `server-only`, axios instance |
| `services/deezer-endpoint.ts` | `deezerEndpoint` | ghép đường dẫn Deezer |
| `server.ts` | `searchDeezer`, `fetchDeezer` | `server-only` |

`index.ts` re-export `components`, `resources`, `services` (không có `deezer-api.ts` hay `server.ts`).

## Vì sao không dùng TanStack Query

Ô tìm nhạc là một query debounce đơn lẻ, gọi route nội bộ rồi render list. `useEffect` + `useState` là đủ; thêm thư viện cache sẽ tạo mô hình data fetching thứ hai trong app, trong khi phần còn lại đọc bằng Server Component.

Nếu sau này cần cache, ưu tiên `fetch` với `next.revalidate` ở route handler, hoặc một hook nhỏ `useDebouncedSearch`.

## Lưu ý

- File từng bị đánh vần `dezzer`; đã đổi thành `deezer` ở tên file, biến và hàm.
- `fetchDeezer` trả `unknown` vì proxy được dùng cho nhiều endpoint chưa có resource riêng.
- Preview Deezer có thể rỗng với bài không cho nghe thử; UI đã chịu được URL rỗng.
