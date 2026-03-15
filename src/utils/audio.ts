"use client";

const sounds = {
	normal: "/sounds/button.mp3",
	disabled: "/sounds/button-error.mp3",
	pop: "/sounds/pop.mp3",
	toggle: "/sounds/toggle.mp3",
} as const;

type SoundType = keyof typeof sounds;

const audioRefs: Partial<Record<SoundType, HTMLAudioElement>> = {};

/**
 * Chạy âm thanh
 */
export function playSound(type: SoundType = "normal") {
	if (typeof window === "undefined") return;

	const isMuted = localStorage.getItem("system-muted") === "true";
	if (isMuted) return;

	if (!audioRefs[type]) audioRefs[type] = new Audio(sounds[type]);
	const audio = audioRefs[type];
	if (!audio) return;

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
		const type = key as SoundType;
		if (!audioRefs[type]) {
			const audio = new Audio(sounds[type]);
			audio.preload = "auto";
			audio.load();
			audioRefs[type] = audio;
		}
	});
}
