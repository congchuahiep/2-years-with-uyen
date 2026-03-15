import axios from "axios";

export const dezzerApi = axios.create({
	// Vì đang dùng API Proxy trên cùng domain, chúng ta để baseURL rỗng
	// Hoặc trỏ đến API nội bộ của chúng ta tại /api/music
	baseURL: "/api/music",
	headers: { "Content-Type": "application/json" },
});
