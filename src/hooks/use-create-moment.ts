import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
	type CreateMomentPayload,
	createMoment,
} from "@/app/moments/create/actions";
import type { Color } from "@/types/color";
import type { DeezerTrack } from "@/types/dezzer";
import type { Moment } from "@/types/moment";
import type { PolaroidImage } from "@/types/polaroid";
import { createClient } from "@/utils/supabase/client";

export type CreateMomentVariables = {
	title: string;
	content: string;
	isDraft: boolean;
	isPublic: boolean;
	eventDate: string;
	letterColor: Color;
	selectedTrack: DeezerTrack | undefined;
	selectedFiles: File[];
	metadata: PolaroidImage[];
};

type UseCreateMomentOptions = Omit<
	UseMutationOptions<Moment, Error, CreateMomentVariables>,
	"mutationFn"
>;

export const useCreateMoment = (options?: UseCreateMomentOptions) => {
	const supabase = createClient();

	const mutationFn = async (
		variables: CreateMomentVariables,
	): Promise<Moment> => {
		const {
			selectedFiles,
			metadata,
			isDraft,
			isPublic,
			selectedTrack,
			...otherData
		} = variables;

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Bạn cần đăng nhập để thực hiện chức năng này.");
		}

		const uploadedMetadata = [...metadata];
		for (let i = 0; i < selectedFiles.length; i++) {
			const file = selectedFiles[i];
			const fileExt = file.name.split(".").pop();
			const fileName = `${user.id}/${Date.now()}-${Math.random()
				.toString(36)
				.substring(7)}.${fileExt}`;

			const { data: uploadData, error: uploadError } = await supabase.storage
				.from("moment_images")
				.upload(fileName, file);

			if (uploadError) {
				console.error("Lỗi upload ảnh:", uploadError);
				throw new Error("Không thể tải ảnh lên hệ thống.");
			}

			const {
				data: { publicUrl },
			} = supabase.storage.from("moment_images").getPublicUrl(uploadData.path);

			if (uploadedMetadata[i]) {
				uploadedMetadata[i].url = publicUrl;
			}
		}

		const payload: CreateMomentPayload = {
			...otherData,
			status: isDraft ? "draft" : isPublic ? "public" : "private",
			metadata: uploadedMetadata,
			music_track: selectedTrack || null,
		};

		return createMoment(payload);
	};

	return useMutation({
		mutationFn,
		...options,
	});
};
