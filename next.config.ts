import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			new URL("https://asskftdtxzdrsmclwjib.supabase.co/**"),
			new URL("https://cdn-images.dzcdn.net/**"),
		],
	},
};

export default nextConfig;
