import type { QuestID } from "./quest";

export type UserProfile = {
	id: string;
	first_name?: string;
	last_name?: string;
	avatar_url?: string;
	completed_quests: QuestID[];
};
