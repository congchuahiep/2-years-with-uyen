import type { ReactNode } from "react";
import type { PageFace } from "../types/page-face";
import type { PageFaceSide } from "../types/page-face";
import BookCover from "../components/BookCover";
import BookPage from "../components/BookPage";
import BookPageScale from "../components/BookPageScale";

/**
 * ! THỨ TỰ MẶT TRANG
 * Đúng (mặc định): mỗi cặp trang emit theo thứ tự (mặt TRÁI, mặt PHẢI).
 * Nếu chạy thử thấy các mặt bị NGƯỢC (mặt trái ra bên phải) — hãy đổi thành
 * `false` và chỉ cần swap 2 dòng trong `buildBookPages` bên dưới.
 */
export const LEFT_PAGE_FIRST = true;

interface BuildBookPagesLayout {
  /** true = 1 trang, false = mở 2 trang */
  portrait: boolean;
}

/**
 * Vẽ một MẶT TRANG theo loại của nó.
 * - cover: component bìa tự vẽ (`outer-front` dùng FrontBookCover khi nối
 *   dữ liệu thật; hiện mọi mặt bìa đều dùng `BookCover`).
 * - paper: BookPage với các item của mặt đó.
 * Chế độ portrait vẽ mọi mặt như trang phải (`side = "right"`).
 */
function renderFace(
  face: PageFace,
  faceIndex: number,
  portrait: boolean,
): ReactNode {
  const side: PageFaceSide = portrait ? "right" : face.side;

  if (face.kind === "cover") {
    return face.side === "left" ? (
      <BookCover side="left" />
    ) : (
      <BookCover side="right" />
    );
  }

  return <BookPage side={side} pageNumber={faceIndex} items={face.items} />;
}

/**
 * Dựng danh sách child cho HTMLFlipBook từ chuỗi mặt trang phẳng.
 * Với `showCover = true`, child đầu tiên là mặt ngoài bìa trước: page-flip
 * tự để nửa trái của spread 0 trống, nên ta không cần mô hình hoá dummy.
 *
 * - Landscape: 2 child liên tiếp tạo thành 1 cặp mặt trang (trái, phải).
 * - Portrait: mỗi mặt trang là 1 child, hiển thị lần lượt như trang phải.
 */
export function buildBookPages(
  faces: PageFace[],
  layout: BuildBookPagesLayout,
): ReactNode[] {
  const children: ReactNode[] = [];

  if (layout.portrait) {
    for (const [index, face] of faces.entries()) {
      children.push(
        <BookPageScale key={`face-${index}`}>
          {renderFace(face, index, layout.portrait)}
        </BookPageScale>,
      );
    }
    return children;
  }

  for (let index = 0; index < faces.length; index += 2) {
    const left = faces[index];
    const right = faces[index + 1];
    children.push(
      <BookPageScale key={`spread-${index / 2}`} className="grid grid-cols-2">
        {left && renderFace(left, index, layout.portrait)}
        {right && renderFace(right, index + 1, layout.portrait)}
      </BookPageScale>,
    );
  }

  return children;
}
