import { redirect } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { createClient } from "@/utils/supabase/server";
import { EditProfileForm } from "./edit-form";
import { route } from "@/configs/route";

export default async function EditProfilePage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect(route.login);
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.single();

	return (
		<main className="min-h-screen flex items-center justify-center p-4">
			<BackButton />

			<div className="w-full max-w-md">
				<EditProfileForm profile={profile} />
			</div>
		</main>
	);
}
