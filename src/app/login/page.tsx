"use client";

import { useActionState } from "react";
import { LockIcon } from "@/components/icon/lock-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoughBox } from "@/components/ui/rough-box";
import { Spinner } from "@/components/ui/spinner";
import { type ActionState, login } from "./actions";
import { RoughNotation } from "react-rough-notation";
import { MuteButton } from "@/components/mute-button";

export default function LoginPage() {
	const [state, action, pending] = useActionState<ActionState, FormData>(
		login,
		null,
	);

	return (
		<main className="flex min-h-screen items-center justify-center p-4 invert-background">
			<MuteButton className="fixed bottom-4 right-4 z-50" />
			<RoughBox
				className="max-w-md w-full z-10"
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
				<div className="text-center mb-4">
					<h1 className="text-4xl font-bold tracking-tight">Our Diary</h1>
					<p className="mt-2 text-lg opacity-80 text-pretty">
						Nhập mật mã để <br /> mở khóa{" "}
						<RoughNotation
							type="highlight"
							color="var(--color-yellow)"
							animationDelay={500}
							multiline
							show
						>
							sổ tay kỉ nịm ^^{" "}
						</RoughNotation>
					</p>
				</div>

				<form className="flex flex-col gap-6" action={action}>
					{state?.error && (
						<RoughBox
							className="text-red-500 text-center font-bold"
							roughConfig={{
								fill: "var(--color-red-200)",
								fillStyle: "zigzag",
								fillWeight: 4,
								stroke: "var(--color-red-500)",
								strokeLineDash: [5, 10],
								strokeLineDashOffset: 5,
								roughness: 2,
								bowing: 0,
							}}
						>
							{state.error}
						</RoughBox>
					)}
					<div className="flex flex-col gap-2">
						<label htmlFor="email" className="font-bold text-lg">
							Email của người đẹp
						</label>
						<Input
							id="email"
							name="email"
							type="email"
							required
							placeholder="abc@gmail.com"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor="password" className="font-bold text-lg">
							Mật khẩu siu bí mật
						</label>
						<Input
							id="password"
							name="password"
							type="password"
							required
							placeholder="••••••••"
						/>
					</div>

					<Button
						className="w-full mx-auto mb-8"
						disabled={pending}
						fill="var(--color-green)"
					>
						{pending ? (
							<>
								<Spinner size={32} strokeWidth={4} stroke="currentColor" />
								Đang mở khoá...
							</>
						) : (
							<>
								<LockIcon className="mb-1" strokeWidth="4" /> Mở khoá
							</>
						)}
					</Button>
				</form>
			</RoughBox>
		</main>
	);
}
