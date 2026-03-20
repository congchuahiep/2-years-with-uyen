import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_PROFILE_QUERY_KEY } from "@/configs/querykey";
import type { InventoryItemID } from "@/types/inventory";
import type { QuestID } from "@/types/quest";
import type { UserProfile } from "@/types/user-profile";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

async function updateInventoryItems(inventoryItemIds: InventoryItemID[]) {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("User not authenticated");

	const { error } = await supabase
		.from("profiles")
		.update({ inventory: inventoryItemIds })
		.eq("id", user.id);

	if (error) throw error;
}

export function useUpdateInventory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateInventoryItems,
		onMutate: async (newInventory) => {
			await queryClient.cancelQueries({ queryKey: USER_PROFILE_QUERY_KEY.me });
			const previousProfile = queryClient.getQueryData(
				USER_PROFILE_QUERY_KEY.me,
			);

			queryClient.setQueryData(
				USER_PROFILE_QUERY_KEY.me,
				(rest: UserProfile[]) => ({
					...rest,
					inventory: newInventory,
				}),
			);

			return { previousProfile };
		},
		// Rollback về state cũ nếu có lỗi
		onError: (_err, _newQuests, context) => {
			queryClient.setQueryData(
				USER_PROFILE_QUERY_KEY.me,
				context?.previousProfile,
			);
		},
		// Fetch lại data từ server để đảm bảo đồng bộ
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY.me });
		},
	});
}
