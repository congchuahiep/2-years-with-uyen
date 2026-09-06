Xin chào, đây sẽ là phần kế hoạch mới cho dự án

# Ý tưởng cũ

### Tổng quan

Trong kế hoạch cũ, dự án thiết kế trang chủ là một trang khá đơn giản [@/app/page.tsx](../src/app/page.tsx). Ban đầu sẽ có một trang lời chào, khi cuộn xuống sẽ bắt đầu lộ diện ra phần nền và sau đó sẽ có 1 đường cong gọi là Timeline, khi người dùng càng cuộn Timeline càng chạy dài ra.

Trên thanh Timeline đó khi kéo đến đến một khúc nhất định sẽ dần dần hiện ra các MomentItem (mỗi Moment sẽ cách nhau một khoảng 35vh), có hiệu ứng animation in và out rất thích mắt. Khi bấm vào MomentItem nó sẽ hiển thị ra trang xem Moment (Moment là một thành phần quan trọng trong dự án, nó giống như một bài đăng Facebook, có thể chửa ảnh, nội dung, nhạc,...)

Tại trang chủ ở góc phải bên dưới có hiển thị các công cụ tool lơ lửng, giúp người dùng truy cập vào các trang như thiết lập tài khoản, tạo Moment,...

### Vấn đề

Hiện tại cách triển khai của dự án trên khá là an toàn, đơn điệu, chưa đủ xuất sắc đối với bản thân mình. Mình cũng có nghĩ tới cách là cho phép người dùng có thể tự trang trí trang chủ, như gắn thêm element vào timeline, tuy nhiên cách triển khai nó sẽ hơi rối rắm. vậy nên mình muốn tìm một làn gió mới để thay đổi

# Ý tưởng mới

### Dẫn nhập

Trong hồi nghĩ lễ 30/4 mình đã suy nghĩ rất nhiều về phương án mới để cải thiện lại dự án, khi đó mình nghĩ rằng vốn ứng dụng này là một Scrapbook mà nhỉ? Sao không làm nó như ScrapBook thật nhỉ? Từ đó mà mình nghĩ ra một ý tưởng mới, thay vì view Moment bằng Timeline, sao lại không sử dụng **flip book**.

### Tổng quan

Thay vì sử dụng Timeline để hiển thị, ta sẽ sử dụng một Flip book. Flip book là một component giống như một cuốn sách thật, người dùng có thể lật trang, có hiệu ứng trang giấy thật, khả năng dùng mouse gesture để lật,... Với spec như sau:

- Bắt đầu từ một trang bìa ngoài cùng, người dùng có thể lật trang tiếp theo bằng thao tác kéo thả để lật, hoặc sử dụng một nút đề điểu khiển lật tiếp
- Người dùng có thể thấy được hai mặt trang cùng một lúc, mặt trái và mặt phải (trừ trang bìa)
- Một mặt trang giấy đó ta sẽ gọi là "FlipPage" (để tránh trùng với khái niệm trang trong Next.js) Với hai mặt trang đó ta sẽ gọi là một cặp trang "PairFlipPage" (trừ trang bìa vì chỉ có 1 mặt trang), ở đây ta quy chuẩn đánh số cho dễ ha _(trang bìa ngoài cùng: 1; cặp trang đầu: 2, 3; cặp trang thứ hai: 4, 5; ... cứ thế tiếp diễn cho đến bìa cuối)_. Người dùng có thể tạo nhiều thực thể cặp trang PairFlipPage tuỳ ý họ. (Dưới database ta sẽ chỉ lưu PairFlipPage, vì thực tế PairFlipPage đã là hai FlipPage rồi, việc phân biệt FlipPage này chỉ để giúp cho việc hiển thị mà thôi)
- Ở mỗi một mặt trang "FlipPage" có layout là một Grid 2x2, tức là 4 ô vuông, với mỗi một ô này cho phép người dùng gắn MomentItem lên được. Nếu như cả hai mặt trang tức là PairFlipPage hết chỗ, thì người dùng có thể tạo một PairFlipPage mới
- Người dùng có thể di chuyển một MomentItem trong một "FlipPage". Và Người dùng cũng có thể hoàn toàn thay đổi vị trí của "MomentItem" sang một "FlipPage" / "PairFlipPage" khác (điều này khác xa so với sử dụng Timeline để hiển thị, vì người dùng có thể đặt MomentItem bất kỳ ở vị trị nào, tuy nhiên điều đó sẽ làm phá hỏng aesthetic timeline của người dùng đây là trade-off)

Các tính năng thêm, chưa cần làm ngay:

- Người dùng có thể tạo FlipTab, nó sẽ mô phỏng index tab của một cuốn sổ thực sự _(Như trong từ điển có mấy cái nhãn A -> Z lồi ra để đánh dấu vị trí nội dung cho dễ nhìn hơn)_, cho phép người dùng đánh dấu cột mốc kỉ niệm ví dụ 2024, 2025, 2026 và khi nhấn vào cái tag đó nó sẽ navigate tới trang đó dễ dàng hơn
- Cho phép gán sticker vào trong một PairFlipPage, sticker này có thể ở bất kỳ vị trí nào trong PairFlipPage mà không làm chiếm dụng layout chứa MomentItem
- Ngoài MomentItem ra thì ta có thể thêm StickyNote vào trong layout chứa MomentItem, Tức rằng layout của PairFlipPage là dạng grid có thể chứa các Item mà Item đó có thể là MomentItem hoặc StickyNote (mai sau có thể mở rộng thêm để add các item khác nữa)

### Kế hoạch

#### Buổi 1: Tái cấu trúc Database & Thiết kế Model (4 tiếng)

Mục tiêu: Đảm bảo Supabase sẵn sàng lưu trữ cấu trúc trang sổ mới.

1. Thiết kế Schema mới:
    - Table `pair_flip_pages`: Lưu thứ tự các cặp trang (page_order), lưu vị trí sticker trong trang bằng JSON (x, y, rotation, scale, color).
    - Table `flip_tabs`: Đánh dấu mục lục (pair_page_id, label, color, position).
    - Table `page_items`: Bảng đa hình (Polymorphic) chứa vị trí của các item trong trang (pair_page_id, side - left/right, grid_index - 0 đến 3, item_type - 'moment' | 'sticky_note', `item_id`).
2. Migration Data:
    - Viết script (hoặc Edge Function) để tự động chuyển đổi các Moment hiện có ở dạng Timeline sang cấu trúc pair_flip_pages (tự động chia 4 Moment vào 1 trang).
3. Tạo API service để kết nối frontend + supabase

#### Buổi 2: Nghiên cứu & Xây dựng Lõi Flip Book Component (4 tiếng)

Mục tiêu: Tạo ra được cuốn sổ có thể lật trang mượt mà. Tuy nhiên cái khó là làm sao để có thể tạo Flip Book Component ăn khớp với style của dự án?

1. Đánh giá thư viện: Nghiên cứu sử dụng thư viện chuyên dụng như react-pageflip (wrapper của page-flip) hoặc xây dựng Custom Component bằng Framer Motion (sử dụng 3D transform rotateY). Hoặc tự triển khai bằng Framer Motion để kiểm soát hoàn toàn giao diện. Một số nguồn tham khảo
    - [https://github.com/vuvandinh123/react-flipbook](https://github.com/vuvandinh123/react-flipbook)
2. Xây dựng Scrapbook Component:
    - Khi lật trang nhanh sẽ không bị cắt animation trước đó.
    - Thiết kế cấu trúc DOM: Cover (Bìa), Các PairFlipPage (Trang trong).
    - Tích hợp gesture (kéo thả vuốt) hoặc nút "Next/Prev" để lật trang.
    - Xử lý logic âm thanh lật giấy (sử dụng use-sound với file tiếng xột xoạt).

#### Buổi 3: Xây dựng Layout Grid 2x2 & Item Renderers (4 tiếng)

Mục tiêu: Hiển thị nội dung lên mặt trang giấy.

1. Tạo FlipPage Component:
    - Thiết kế giao diện 1 mặt trang với CSS Grid (2 cột x 2 hàng).
    - Áp dụng phong cách Doodle (Sử dụng doodle.css làm nền giấy, màu giấy cũ ngả vàng).
2. Xây dựng Item Components:
    - MomentGridItem: Tái sử dụng Polaroid component hiện tại nhưng điều chỉnh size cho vừa 1 ô grid.
    - StickyNoteItem: Tạo component mới hình tờ giấy note nhỏ, viền răng cưa (RoughBox), có font chữ handwriting.

#### Buổi 4: Tích hợp Kéo/Thả (Drag & Drop) Cơ bản (4 tiếng)

Mục tiêu: Cho phép người dùng sắp xếp lại các item.

0. Sử dụng một nút để chuyển đổi sang chế độ sửa FlipBook
1. Setup @dnd-kit/core: Cấu hình Drag & Drop Context bao bọc toàn bộ cuốn sổ.
2. Draggable & Droppable:
    - Biến các ô Grid thành các Droppable zones.
    - Biến MomentGridItem và StickyNoteItem thành Draggable.
3. Logic hoán đổi (Swap/Move): Xử lý sự kiện onDragEnd để cập nhật vị trí mới của item (chuyển ô trong cùng 1 trang, hoặc kéo qua trang đối diện nếu đang mở PairFlipPage).

#### Buổi 5: Drag & Drop Nâng cao & Hệ thống Sticker (4 tiếng)

Mục tiêu: Hoàn thiện tính năng tương tác tự do.

1. Chuyển trang khi kéo (Cross-page Dragging): (Phần khó nhất) Xử lý logic khi người dùng cầm 1 tấm ảnh kéo về sát mép màn hình -> Tự động lật sang trang tiếp theo/trước đó.
2. Lớp Sticker Tự do (Free-float Layer):
    - Xây dựng một div absolute đè lên trên PairFlipPage.
    - Cho phép người dùng kéo thả Sticker vào lớp này (lưu tọa độ X, Y tuyệt đối, xoay, scale tương tự Bảng Polaroid cũ).

#### Buổi 6: FlipTab Navigation & Tích hợp Toolbar (4 tiếng)

Mục tiêu: Hoàn thiện UI/UX và kết nối với các phần khác của hệ thống.

1. Xây dựng FlipTab Component:
    - Render các thẻ nhãn (tab) thò ra ở cạnh phải/trái của cuốn sổ.
    - Logic bấm vào Tab: Cuốn sổ tự động lật (animate lật nhanh nhiều trang) đến đúng PairFlipPage đó.
2. Điểu chỉnh lại tool Thêm Moment:
    - Khi bấm vào nút để điều hướng sang trang Thêm Moment, nó sẽ lật FlipBook đến trang cuối cùng và hiển thị Form Thêm Moment
    - Điều chỉnh lại UI để khớp
