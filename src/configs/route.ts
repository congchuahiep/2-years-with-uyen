export const route = {
	home: "/",
	moments: {
		create: "/moments/create",
		detail: (id: string) => `/moments/detail/${id}`,
	},

	login: "/login",
	profile: {
		edit: "/profile/edit",
		view: (userId: string) => `/profile/${userId}`,
	},
};
