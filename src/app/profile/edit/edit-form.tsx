"use client";

import { useActionState, useEffect, useRef } from "react";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Button } from "@/components/ui/button";
import { ErrorMessageBox } from "@/components/ui/error-message-box";
import { Input } from "@/components/ui/input";
import { RoughBox } from "@/components/ui/rough-box";

type Profile = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	avatar_url: string | null;
};

import { type FormState, updateUserProfile } from "./actions";

const initialState: FormState = {
	error: undefined,
	success: false,
};

export function EditProfileForm({ profile }: { profile: Profile | null }) {
	const [state, formAction] = useActionState(updateUserProfile, initialState);
	const formRef = useRef<HTMLFormElement>(null);

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
			<form ref={formRef} action={formAction} className="space-y-6">
				<h1 className="text-2xl font-bold text-center text-slate-800 font-display">
					Chỉnh sửa thông tin
				</h1>

				{state?.error && <ErrorMessageBox>{state.error}</ErrorMessageBox>}
				{state?.success && (
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
					/>
				</div>

				<Button type="submit" className="w-full">
					Lưu thay đổi
				</Button>
			</form>
		</RoughBox>
	);
}
