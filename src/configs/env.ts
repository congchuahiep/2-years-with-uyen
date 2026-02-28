import * as z from "zod";

const EnvSchema = z.object({
	SUPABASE_URL: z.string(),
	SUPABASE_ANON_KEY: z.string(),
});

/**
 * Tạo và kiểm tra định dạng của biến môi trường (chỉ lưu trữ các biến phía
 * client)
 *
 * @returns Một đối tượng chứa các biến môi trường đã được kiểm tra định dạng
 */
const createEnv = () => {
	const rawEnvVars = {
		SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	};
	const parsedEnv = EnvSchema.safeParse(rawEnvVars);

	// Tiến hành kiểm tra định dạng biến môi trường, nếu biến môi trường có
	// kiểu dữ liệu không hợp lệ => dừng chương trình
	if (!parsedEnv.success) {
		throw new Error(
			`Invalid env provided. The following variables are missing or invalid:
      ${Object.entries(parsedEnv.error.issues)
				.map(([k, v]) => `- ${k}: ${v.message}`)
				.join("\n")}
      `,
		);
	}

	return parsedEnv.data ?? {};
};

export const env = createEnv();
