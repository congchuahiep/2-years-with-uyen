"use client";

import { useRef } from "react";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Button } from "@/components/ui/button";
import { ErrorMessageBox } from "@/components/ui/error-message-box";
import { Input } from "@/components/ui/input";
import { RoughBox } from "@/components/ui/rough-box";
import { Spinner } from "@/components/ui/spinner";
import {
	type UpdateProfileVariables,
	useUpdateProfile,
} from "@/hooks/use-update-profile";
import type { UserProfile } from "@/types/user-profile";

function EditProfileForm({ profile }: { profile: UserProfile | null }) {
	const formRef = useRef<HTMLFormElement>(null);

	const { mutate, isPending, error, isSuccess } = useUpdateProfile();

	const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		const payload: UpdateProfileVariables = {
			first_name: formData.get("first_name") as string,
			last_name: formData.get("last_name") as string,
			avatarFile: formData.get("avatar") as File | null,
			current_avatar_url: formData.get("current_avatar_url") as string,
		};

		mutate(payload);
	};

	return (
		<RoughBox
			roughConfig={{
				roughness: 4,
				stroke: "transparent",
				strokeWidth: 2.5,
				fill: "var(--color-amber-50)",
				fillStyle: "zigzag",
				fillWeight: 12,
			}}
			padding={32}
		>
			<form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
				<h1 className="text-2xl font-bold text-center text-slate-800 font-display">
					Chỉnh sửa thông tin
				</h1>

				{error && <ErrorMessageBox>{error.message}</ErrorMessageBox>}
				{isSuccess && (
					<div className="p-3 bg-green-100 text-green-800 border border-green-300 rounded-md text-sm">
						Cập nhật thông tin thành công!
					</div>
				)}

				<AvatarUpload
					defaultUrl={profile?.avatar_url ?? null}
					name="avatar"
					className="size-64"
				/>

				<input
					type="hidden"
					name="current_avatar_url"
					defaultValue={profile?.avatar_url || ""}
				/>

				<div className="flex flex-col gap-2">
					<label htmlFor="first_name" className="font-bold text-lg">
						Tên
					</label>
					<Input
						id="first_name"
						name="first_name"
						type="text"
						defaultValue={profile?.first_name || ""}
						required
						disabled={isPending}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="last_name" className="font-bold text-lg">
						Họ
					</label>
					<Input
						id="last_name"
						name="last_name"
						type="text"
						defaultValue={profile?.last_name || ""}
						required
						disabled={isPending}
					/>
				</div>

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending ? <Spinner size={24} /> : "Lưu thay đổi"}
				</Button>
			</form>
		</RoughBox>
	);
}

export default EditProfileForm;
