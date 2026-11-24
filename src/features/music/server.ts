import "server-only";

import axios from "axios";
import { dezzerEndpoint } from "./services/dezzer-endpoint";

const DEEZER_BASE = "https://api.deezer.com";

/** Tìm track trên Deezer từ server để tránh CORS. */
export async function searchDeezer(query: string) {
	const response = await axios.get(
		`${DEEZER_BASE}${dezzerEndpoint.search(query)}`,
	);
	return response.data;
}

/** Proxy một endpoint bất kỳ của Deezer (track, artist, ...). */
export async function fetchDeezer(path: string[], search: string) {
	const joined = path.join("/");
	const response = await axios.get(`${DEEZER_BASE}/${joined}${search}`);
	return response.data;
}
