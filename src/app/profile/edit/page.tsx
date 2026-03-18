"use client";

import { BackButton } from "@/components/back-button";
import { Spinner } from "@/components/ui/spinner";
import { useUserProfile } from "@/hooks/use-user-profile";
import cn from "@/utils/cn";
import EditProfileForm from "./edit-form";

export default function EditProfilePage() {
	const { data, isFetching, error } = useUserProfile();
	const profile = data ? data : null;

	if (error) throw error;

	return (
		<main className="min-h-screen flex items-center justify-center p-4">
			<BackButton />

			<div className="w-full max-w-md">
				{isFetching ? (
					<div
						className={cn(
							"flex items-center justify-center gap-2",
							"text-white font-bold text-xl",
						)}
					>
						<Spinner className="size-12" />
						Loading...
					</div>
				) : (
					<EditProfileForm profile={profile} />
				)}
			</div>
		</main>
	);
}
