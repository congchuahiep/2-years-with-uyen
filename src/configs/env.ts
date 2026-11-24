/** Đọc biến môi trường bắt buộc; ném lỗi rõ ràng nếu thiếu. */
export function getEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Thiếu biến môi trường ${name}`);
	}
	return value;
}

export function getOptionalEnv(name: string): string | undefined {
	return process.env[name] || undefined;
}
