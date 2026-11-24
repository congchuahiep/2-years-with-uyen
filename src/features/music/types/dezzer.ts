export type DeezerTrack = {
	id: number;
	title: string;
	link: string;
	preview: string;
	artist: {
		id: number;
		name: string;
		picture_small: string;
	};
	album: {
		id: number;
		title: string;
		cover_small: string;
		cover_medium: string;
	};
};
