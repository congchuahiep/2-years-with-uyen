import RoughBox from "@/shared/components/RoughBox";
export default function MaintenancePage() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center p-8 bg-purple-400">
      <RoughBox
        className="w-full max-w-lg text-pretty"
        containerClassName="space-y-2 [&>p]:text-yellow-800"
        padding={32}
        roughConfig={{
          fill: "var(--color-yellow-100)",
          stroke: "var(--color-yellow-600)",
          fillStyle: "solid",
          strokeWidth: 2,
          roughness: 1.5,
        }}
      >
        <h1 className={"text-3xl font-bold text-yellow-700 mb-4"}>
          🛠️ Đang bảo trì...
        </h1>
        <p>Cuốn sổ lưu niệm này hiện đang được nâng cấp cấu trúc mới</p>
        <p>
          Quá trình này có thể mất một chút thời gian để đảm bảo các kỷ niệm
          không bị xáo trộn. Xin vui lòng truy cập lại sau nhé! 💕
        </p>
      </RoughBox>
    </main>
  );
}
