"use client";

type SoundType = "normal" | "disabled" | "pop";

const sounds: Record<SoundType, string> = {
	normal: "/sounds/button.mp3",
	disabled: "/sounds/button-error.mp3",
	pop: "/sounds/pop.mp3",
};

const audioRefs: Partial<Record<SoundType, HTMLAudioElement>> = {};

export function playSound(type: SoundType = "normal") {
	if (typeof window === "undefined") return;

	// Kiểm tra trạng thái tắt tiếng trong localStorage
	const isMuted = localStorage.getItem("system-muted") === "true";
	if (isMuted) return;

	// Khởi tạo đối tượng Audio nếu chưa có trong cache
	if (!audioRefs[type]) {
		audioRefs[type] = new Audio(sounds[type]);
	}

	const audio = audioRefs[type];
	if (!audio) return;

	// Reset lại vị trí phát: Dù file nhạc chưa phát xong nhưng nếu người dùng
	// click liên tục thì file vẫn sẽ phát đè lại từ đầu ngay lập tức!
	audio.currentTime = 0;

	// Gọi hàm play, bọc trong catch() để tránh trình duyệt báo lỗi khi
	// chặn autoplay (thường xảy ra nếu người dùng chưa tương tác với trang)
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
		const type = key as SoundType;
		if (!audioRefs[type]) {
			const audio = new Audio(sounds[type]);
			audio.preload = "auto";
			audioRefs[type] = audio;
		}
	});
}
