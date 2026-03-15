export const dezzerEndpoint = {
	search: (query: string) => `/search?q=${encodeURIComponent(query)}`,
	track: (id: string) => `/track/${id}`,
};
