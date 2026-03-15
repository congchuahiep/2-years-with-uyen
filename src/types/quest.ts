export enum QuestID {
	CreateFirstMoment = "CREATE_FIRST_MOMENT",
	PersonalizeProfile = "PERSONALIZE_PROFILE",
	Collector = "COLLECTOR",
}

export interface Quest {
	id: QuestID;
	title: string;
	description: string;
	dependencies: QuestID[];
}

export const ALL_QUESTS: Quest[] = [
	{
		id: QuestID.CreateFirstMoment,
		title: "Viết Kỷ Niệm Đầu Tiên",
		description: "...",
		dependencies: [],
	},
	{
		id: QuestID.PersonalizeProfile,
		title: "Cá Nhân Hóa",
		description: "...",
		dependencies: [],
	},
	{
		id: QuestID.Collector,
		title: "Nhà Sưu Tầm",
		description: "Tạo đủ 5 kỷ niệm",
		dependencies: [QuestID.CreateFirstMoment],
	},
];
