"use client";

const sounds = {
	normal: "/sounds/button.mp3",
	disabled: "/sounds/button-error.mp3",
	pop: "/sounds/pop.mp3",
	toggle: "/sounds/toggle.mp3",
	yay: "/sounds/yay.mp3",
	chestOpen: "/sounds/chest-open.mp3",
	chestClose: "/sounds/chest-close.mp3",
	// Nhiều bản thu tiếng lật trang — mỗi lần phát sẽ chọn ngẫu nhiên 1 file
	flip: [
		"/sounds/page-flip-1.mp3",
		"/sounds/page-flip-2.mp3",
		"/sounds/page-flip-3.mp3",
		"/sounds/page-flip-4.mp3",
	],
	flap: "/sounds/page-flap.mp3",
} as const;

type SoundType = keyof typeof sounds;

// Mỗi file âm thanh chỉ tạo 1 element Audio duy nhất để tái sử dụng khi phát lại
const audioRefs = new Map<string, HTMLAudioElement>();

// Ghi nhớ file vừa phát của từng loại để tránh bị random trùng liên tiếp
const lastPlayed = new Map<SoundType, string>();

/**
 * Lấy danh sách đường dẫn của một loại âm thanh.
 * Giá trị trong `sounds` có thể là 1 chuỗi (1 file) hoặc 1 mảng (nhiều biến thể).
 */
function getPaths(type: SoundType): readonly string[] {
	const sound = sounds[type];
	if (typeof sound === "string") return [sound];
	return sound;
}

/**
 * Chọn file sẽ phát: loại có nhiều biến thể thì random 1 file,
 * tránh trùng file vừa phát ở lần trước để tiếng lật luân phiên tự nhiên hơn.
 */
function pickPath(type: SoundType): string {
	const paths = getPaths(type);
	if (paths.length === 1) return paths[0];

	const previous = lastPlayed.get(type);
	const candidates = paths.filter((path) => path !== previous);
	const path = candidates[Math.floor(Math.random() * candidates.length)];
	lastPlayed.set(type, path);
	return path;
}

function getAudio(path: string): HTMLAudioElement {
	let audio = audioRefs.get(path);
	if (!audio) {
		audio = new Audio(path);
		audioRefs.set(path, audio);
	}
	return audio;
}

/**
 * Chạy âm thanh. Loại âm thanh có nhiều file (khai báo mảng)
 * sẽ phát ngẫu nhiên 1 file mỗi lần.
 */
export function playSound(type: SoundType = "normal") {
	if (typeof window === "undefined") return;

	const isMuted = localStorage.getItem("system-muted") === "true";
	if (isMuted) return;

	const audio = getAudio(pickPath(type));

	// Reset lại vị trí phát: Dù file nhạc chưa phát xong nhưng nếu người dùng
	// click liên tục thì file vẫn sẽ phát đè lại từ đầu ngay lập tức
	audio.currentTime = 0;
	audio.volume = 0.5;
	audio.play().catch((err) => {
		console.warn("Trình duyệt chặn phát âm thanh:", err);
	});
}

/**
 * Preload các tệp âm thanh để giảm độ trễ khi click lần đầu.
 */
export function preloadSounds() {
	if (typeof window === "undefined") return;

	Object.keys(sounds).forEach((key) => {
		getPaths(key as SoundType).forEach((path) => {
			if (audioRefs.has(path)) return;
			const audio = getAudio(path);
			audio.preload = "auto";
			audio.load();
		});
	});
}
