export enum QuestID {
	Intro = "INTRO",
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
		id: QuestID.Intro,
		title: "MÌNH LÀM QUEN NHÁ!",
		description: "",
		dependencies: [],
	},
	{
		id: QuestID.PersonalizeProfile,
		title: "Cá nhân hoá",
		description: "...",
		dependencies: [QuestID.Intro],
	},
	{
		id: QuestID.CreateFirstMoment,
		title: "Khoảng khắc đầu tiên!",
		description: "Viết và tạo một khoảng khắc đầu tiên của bạnnnnn",
		dependencies: [QuestID.Intro],
	},
	{
		id: QuestID.Collector,
		title: "Nhà Sưu Tầm",
		description: "Tạo đủ 5 kỷ niệm",
		dependencies: [QuestID.CreateFirstMoment],
	},
];
