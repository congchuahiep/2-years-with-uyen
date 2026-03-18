import { useQuery } from "@tanstack/react-query";
import type { UserProfile } from "@/types/user-profile";
import { createClient } from "@/utils/supabase/client";

export const userProfileQueryKey = ["profile"];

export const useUserProfile = () => {
	const supabase = createClient();

	return useQuery<UserProfile | null>({
		queryKey: userProfileQueryKey,
		queryFn: async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			// Nếu không có user, không cần fetch profile, trả về null.
			if (!user) return null;

			const { data: profile, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", user.id)
				.single();

			if (error) {
				console.error("Lỗi lấy user profile:", error);
				throw new Error("Không thể tải được thông tin người dùng.");
			}

			return profile;
		},
		placeholderData: null,
		refetchOnWindowFocus: false,
		// staleTime: Infinity: Dữ liệu sẽ được coi là "mới" mãi mãi,
		// và sẽ chỉ được fetch lại khi cache bị invalidate hoặc reset.
		// Điều này biến nó thành một "global state" được phục vụ từ cache.
		staleTime: Infinity,
		enabled: true,
	});
};
