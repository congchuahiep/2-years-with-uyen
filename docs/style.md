# Phong cách Thiết kế và Giao diện

Tài liệu này định nghĩa rõ ràng về phong cách mỹ thuật của dự án "2 Years with Uyen". Để duy trì sự nhất quán, các hướng dẫn dưới đây phải được tuân thủ sát sao trong quá trình phát triển các thành phần mới trên giao diện.

## Chủ Đề Cốt Lõi
Dự án được xây dựng dựa trên khái niệm Sổ lưu niệm (Scrapbook) thực tế kết hợp với Nhật Ký (Journaling). Nó mang lại cảm giác ấm áp, thủ công và đầy thú vị khi sử dụng các bố cục phi tuyến tính hoặc bất đối xứng (Asymmetry).
Mô phỏng một mặt bàn làm việc hoặc một cuốn sổ tay đang mở, nội dung dùng để lưu giữ kỷ niệm và kể các câu chuyện tình yêu qua các năm.

## Yếu tố Đồ họa (Doodles)
Không giống như hầu hết các ứng dụng web thông thường, dự án này hạn chế sử dụng các Border (Viền) hoặc Background vuông vức, thẳng tắp. 
Thay vào đó, nó thường xuyên áp dụng:
- **Nét vẽ tay ngắn (Rough strokes)**: Thông qua thư viện Rough.js và component tự chỉnh `RoughBox`, mọi hộp thoại hoặc khung input đều được bao quát bằng các đường viền có độ rung nhẹ, mang đến cảm giác như chúng được vẽ bởi tốc độ chấm của một cây bút chì chứ không phải từ một dòng lệnh hệ thống.
- **Thành phần thủ công nhân tạo**: Một số chiếc kéo lót bằng giấy hoặc sticker, miếng Washi Tapes để tô thêm sắc thái hoặc hiệu ứng xuyên thể. Những icon cũng sẽ ưu tiên được phác thảo bằng phương trình của Roughjs.

## Bảng màu (Color Palette)
- Chiếm chủ đạo là các tông màu pastel (Xanh lá, Hồng, Tím nhạt và Vàng Nhạt). 
- Chúng mang lại khuynh hướng nhẹ nhàng và ấm áp hoặc một chút cổ điển (Vintage).
- Nếu một phần tử thật sự quan trọng, nó mới sử dụng tông màu rực rỡ để nổi bật và thu hút sự chú ý. Hiện tại bảng màu đang được đặt thực tế thường qua hệ thống Variables trong `globals.css`.

## Chuyển động và Tương tác
- **Kiểu tương tác (Hover/Active)**: Thay vì thay đổi độ mờ của các đối tượng chủ đạo như hiện tượng Fade-in thường thấy, khi con trỏ chuột bay đến sẽ sinh ra hiệu ứng zoom hoặc xoay nhẹ tự nhiên và sống động (Wiggle effect) khoảng một đến hai góc độ. Wiggle hoặc Spring để tạo sự rung rinh thật nhất để đánh vào hiệu ứng giấy tự nhiên.
- **Micro-Animations**: Các chi tiết thao tác kéo/thả ảnh tại Polaroid Board dùng logic Vật lý thông qua Framer Motion sẽ dễ dàng biểu đạt được các sức nặng quán tính thay vì chỉ bay cứng nhắc sang chỗ khác.

Bất kỳ tính năng giao diện mới nào được thêm vào dự án đều nên duyệt và đảm bảo tính đồng nhất với 4 tiểu mục phong cách này nhằm gìn giữ sự thơ mộng, nhẹ nhàng sẵn có của sản phẩm.
