import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QuestID } from "@/types/quest";
import type { UserProfile } from "@/types/user-profile";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
const USER_PROFILE_QUERY_KEY = ["user-profile"];

async function updateCompletedQuests(completedQuests: QuestID[]) {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("User not authenticated");

	const { error } = await supabase
		.from("profiles")
		.update({ completed_quests: completedQuests })
		.eq("id", user.id);

	if (error) throw error;
}

export function useCompletedQuestsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCompletedQuests,
		onMutate: async (newQuests) => {
			await queryClient.cancelQueries({ queryKey: USER_PROFILE_QUERY_KEY });
			const previousProfile = queryClient.getQueryData(USER_PROFILE_QUERY_KEY);

			queryClient.setQueryData(
				USER_PROFILE_QUERY_KEY,
				(rest: UserProfile[]) => ({
					...rest,
					completed_quests: newQuests,
				}),
			);

			return { previousProfile };
		},
		// Rollback về state cũ nếu có lỗi
		onError: (_err, _newQuests, context) => {
			queryClient.setQueryData(
				USER_PROFILE_QUERY_KEY,
				context?.previousProfile,
			);
		},
		// Fetch lại data từ server để đảm bảo đồng bộ
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
		},
	});
}
