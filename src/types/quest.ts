export enum QuestID {
	Intro = "INTRO",
	PersonalizeProfile = "PERSONALIZE_PROFILE",
	MysteryChest = "MYSTERY_CHEST",
	FragmentOfMoment1 = "FRAGMENT_OF_MOMENT_1",
	FragmentOfMoment2 = "FRAGMENT_OF_MOMENT_2",
	CreateFirstMoment = "CREATE_FIRST_MOMENT",
	FindTheMusicBox = "FIND_THE_MUSIC_BOX",
}

export interface Quest {
	id: QuestID;
	title: string;
	index: number;
	description: string;
	dependencies: QuestID[];
}

export const ALL_QUESTS: Quest[] = [
	{
		index: 0,
		id: QuestID.Intro,
		title: "MÌNH LÀM QUEN NHÁ!",
		description:
			"\tGửi bé iu siu cấp hờn dỗi của anh 😚! \n\n\tMón quà này không chỉ đơn thuần là một ứng dụng tầm thường, mà nó còn ẩn chứa một bí mật đang chờ em giải mã 😱. Anh đã bí mật thiết kế một minigame trinh thám đẳng cấp với những câu đố hóc búa 🕵️. Với mỗi bước đi sẽ là một manh mối, mỗi câu trả lời đúng sẽ dẫn em đến gần hơn với điều bất ngờ cuối cùng. Em có đủ can đảm và sự thông minh để cùng anh phá giải vụ án 'Món quà bí ẩn' này không? Nếu đã sẵn sàng nhập vai mật vụ, hãy nhấn vào nút bên dưới để bắt đầu cuộc hành trình ngay nhé! Anh chờ em ở đích đến 🦛!",
		dependencies: [],
	},
	{
		index: 1,
		id: QuestID.PersonalizeProfile,
		title: "Em là ai?",
		description:
			"\tỒ vậy là em đã chấp nhận thử thách 🤔 à? Anh nghĩ em sẽ từ chối cuộc chơi vì lười cơ 🤔! \n\n\tHừmmmmmm, thì câu truyện là thế này. Vào một đêm đẹp trời, cụ thể là đêm 9/3/2024 hai chúng ta đã iu nhau 👩‍❤️‍💋‍👨, anh cứ ngỡ rằng mọi thứ sẽ diễn biến tốt đẹp kể từ đó... Nhưng không, cuộc hành trình chỉ mới bắt đầu, anh và em đã cùng nhau vui vẻ, tươi cười, hạnh phúc, nhưng cũng có lúc buồn bã, giận dữ và đau đớn. Nhưng thật tuyệt vời vì sau bao nhiêu cuộc hành trình, chúng ta vẫn bên nhau, và còn gì tuyệt vời hơn khi kỉ niệm này chúng ta cùng nhau trải nghiệm lại cuộc hành trình ấy? Lí do chính anh tạo minigame này là để cùng nhau hành trình lại quá khứ, giúp ta quay về những 'khoảng khắc' ấy (chắc là vậy)!!! \n\n\tVà vì là bắt đầu mà? Ta nên xuất phát từ việc chào hỏi,... Em là ai? Hãy trả lời câu hỏi này bằng cách cung cấp họ và tên của em + avatar nhé 🤫",
		dependencies: [QuestID.Intro],
	},
	{
		index: 3,
		id: QuestID.FragmentOfMoment2,
		title: "Mảnh ký ức 2",
		description:
			"\tVới mảnh thứ hai, bí mật được dấu kín trong một khoảng khắc khác, một khoảng khắc mà.. Hai chúng ta không muốn nhớ đến,...",
		dependencies: [QuestID.PersonalizeProfile],
	},
	{
		index: 4,
		id: QuestID.FragmentOfMoment1,
		title: "Mảnh ký ức 1",
		description:
			"\tChà, thì ra tên em là Uyên (hi vọng em không nhập vào một cái tên bậy bạ nào đó 👿💢). Thì Uyên à, ở đây anh có lưu trữ khoảng khắc của đôi ta, hầu hết là vui, buồn thì anh giấu ^^. Không biết trước khi bắt đầu trò này em đã đọc hết các mảnh khoảng khắc chưa nhỉ? Vì giờ em phải lục lại nó đấy ^^ Tại đây anh có giấu 2 mảnh khoảng khắc cực kỳ đặc biệt (trang sau chứa hint về mảnh 2), mỗi mảnh đều chứa một bí mật đặc biệt đang đợi em tìm ra.\n\n\tVới mảnh đầu tiên chứa bí mật được dấu kín trong một khoảng khắc mà tóc anh siu dài, chuyến đi siu chất, em còn nhớ không?",
		dependencies: [QuestID.PersonalizeProfile],
	},
	{
		index: 5,
		id: QuestID.MysteryChest,
		title: "Kho báu bí ẩn",
		description:
			"\tA ha! Em đã tìm thấy được kho báu rồi, nhưng liệu em có biết cách mở nó ra không nhỉ?",
		dependencies: [QuestID.FragmentOfMoment1, QuestID.FragmentOfMoment2],
	},
	{
		index: 6,
		id: QuestID.CreateFirstMoment,
		title: "Khoảng khắc đầu tiên!",
		description:
			"\tThật tuyệt vời! Em vừa mở được tính năng tạo khoảng khắc rùi đóoooo, chức năng này cho phép em có thể gắn những khoảng khắc lên 'cây timeline' mà chẳng cần nhờ anh nèeeeeee!\n\n\tKhi em tạo khoảng khắc em có thể gắn ảnh, viết tựa đề, đặt ngày sự kiện, nội dung,... và có những tính năng chưa được bí ẩn nữa đó ^^. Vậy thì sao giờ không thử dùng nó đi nhỉ? Hãy nêu cảm nhận của em về phần minigame vừa rồi điiiii!",
		dependencies: [QuestID.MysteryChest],
	},
	{
		index: 7,
		id: QuestID.FindTheMusicBox,
		title: "Tìm hộp nhạc bị đánh cắp",
		description:
			"\tQuaooooo, khoảng khắc đầu tiên mà em viết thậy là hayyyyy (nói giọng thảo mai). Nhưng nếu em để ý thì tại trang tạo khoảng khắc dưới góc trái nó hơi trống trống, vì CHIẾC HỘP NHẠC đã bị ĐÁNH CẮP RỒI!!! Đã có 1 con chuột gian xảoooo đánh cắp nó huhuhuhu! Em cần lần theo manh mối mà nó để lại! Lần cuối nó được nhìn thấy là 14-6!!! Liệu em có thể tìm thấy không??",
		dependencies: [QuestID.CreateFirstMoment],
	},
];
