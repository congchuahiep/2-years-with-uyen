import {
	type UseMutationOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	type UpdateProfilePayload,
	updateUserProfile,
} from "@/app/profile/edit/actions";
import { USER_PROFILE_QUERY_KEY } from "@/configs/querykey";
import type { UserProfile } from "@/types/user-profile";
import { createClient } from "@/utils/supabase/client";

export type UpdateProfileVariables = {
	first_name: string;
	last_name: string;
	avatarFile: File | null;
	current_avatar_url: string;
};

type UseUpdateProfileOptions = Omit<
	UseMutationOptions<UserProfile, Error, UpdateProfileVariables>,
	"mutationFn"
>;

export const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
	const queryClient = useQueryClient();
	const supabase = createClient();

	const mutationFn = async (variables: UpdateProfileVariables) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Bạn cần đăng nhập để thực hiện hành động này.");
		}

		let avatar_url = variables.current_avatar_url;

		if (variables.avatarFile && variables.avatarFile.size > 0) {
			const filePath = `${user.id}/${Date.now()}_${variables.avatarFile.name}`;
			const { data: uploadData, error: uploadError } = await supabase.storage
				.from("profile_avatars")
				.upload(filePath, variables.avatarFile, {
					upsert: true,
				});

			if (uploadError) {
				console.error("Lỗi tải lên avatar:", uploadError);
				throw new Error("Không thể tải lên avatar. Vui lòng thử lại.");
			}

			const { data: publicUrlData } = supabase.storage
				.from("profile_avatars")
				.getPublicUrl(uploadData.path);
			avatar_url = publicUrlData.publicUrl;
		}

		const payload: UpdateProfilePayload = {
			first_name: variables.first_name,
			last_name: variables.last_name,
			avatar_url: avatar_url,
		};

		return updateUserProfile(payload);
	};

	return useMutation({
		...options,
		mutationFn,
		onSuccess: (updatedProfile, ...params) => {
			queryClient.setQueryData(USER_PROFILE_QUERY_KEY.me, updatedProfile);
			options?.onSuccess?.(updatedProfile, ...params);
		},
		onSettled: (...params) => {
			queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY.me });
			options?.onSettled?.(...params);
		},
	});
};
