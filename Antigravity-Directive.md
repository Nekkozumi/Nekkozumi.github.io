# 🐙 THE THING STUDIO - WEB DEVELOPMENT DIRECTIVE

## 1. Hệ thống Phân vai (Role System)
*   **Product Owner (User):** Người duyệt tiến độ, kiểm tra UI/UX trên macOS, cấp quyền thực thi.
*   **System Architect (Gemini):** Người lên ý tưởng thiết kế, cấu trúc hệ thống và quy định tech stack.
*   **Execution Agent (Antigravity):** Chịu trách nhiệm khởi tạo project, viết code, triển khai logic animation, xử lý lỗi và báo cáo trạng thái hoàn thành các Checkpoint.

## 2. Thông tin Dự án (Project Specs)
*   **Mục tiêu:** Landing page tĩnh (Static Website) host trên GitHub Pages.
*   **Tech Stack:** Vite + Vanilla JS (hoặc TS) + SCSS + GSAP + PixiJS.
*   **Bảng màu:** Chủ đạo Deep Void Black (#080C14), nhấn bằng Crimson (#D74343) và Taupe (#A17F67).
*   **Nội dung cốt lõi:** Giới thiệu trực tiếp các dự án game (như tựa game sinh tồn roguelike và game giải đố 8-bit retro), không giới thiệu thành viên.

## 3. Yêu cầu Tính năng & Animation (Key Features)
1.  **Cthulhu Watcher (Header):** 
    *   Desktop: Đặt ở trên cùng trang web. Sử dụng PixiJS để vẽ/điều khiển mắt Cthulhu liên tục tracking theo tọa độ chuột của người dùng.
    *   Mobile: Vô hiệu hóa event tracking chuột, mắt chỉ nhìn thẳng.
2.  **Hero Section:** 
    *   Không gian mơ hồ, tối tăm. Chỉ hiển thị chữ/hiệu ứng mờ ảo (concept "Things").
3.  **Tentacle Scrollbar (Thanh cuộn):** 
    *   Thay thế thanh cuộn mặc định của trình duyệt. 
    *   Sử dụng GSAP ScrollTrigger: Khi người dùng cuộn xuống, thanh cuộn hiện hình là một xúc tu đang vươn dài ra.
4.  **Background Shift:** 
    *   Các bóng đen hình xúc tu khổng lồ chuyển động chậm lờ mờ ở background (Layer dưới cùng), tạo cảm giác web đang "thở".
5.  **Button Interactions (Hover & Click):**
    *   *Hover:* Các xúc tu nhỏ rụt lại hoặc bao quanh viền nút.
    *   *Click:* Tạm dừng event click mặc định trong vài mili-giây. Dùng GSAP kích hoạt animation một xúc tu từ background phi lên, "nhấn" vật lý vào nút, sau đó mới trigger hành động chuyển trang/mở link.

## 4. Báo cáo Tiến độ (Agent Task Checklist)
*Antigravity Agent: Hãy thay đổi trạng thái [ ] thành [x] và in ra console báo cáo sau khi hoàn thành mỗi task.*

### Phase 1: Khởi tạo & Setup
- [ ] Khởi tạo Vite project (Vanilla JS).
- [ ] Cài đặt dependencies: `npm install gsap pixi.js`.
- [ ] Thiết lập cấu trúc thư mục (assets, styles, scripts) và import logo.

### Phase 2: Core Layout & Cthulhu Watcher
- [ ] Viết layout cơ bản với SCSS (setup biến màu).
- [ ] Tích hợp PixiJS lên Header: Khởi tạo thực thể Cthulhu.
- [ ] Viết logic toán học (Math.atan2) để xoay con mắt/xúc tu theo event `mousemove`. Xử lý fallback cho Mobile.

### Phase 3: GSAP Animations
- [ ] Xây dựng Hero Section mơ hồ.
- [ ] Tích hợp GSAP ScrollTrigger để làm Tentacle Scrollbar.
- [ ] Code logic CSS/GSAP cho Background Shift.

### Phase 4: Nút bấm & Xúc tu Click
- [ ] Xây dựng component Nút bấm cho các game (Roguelike & 8-bit puzzle).
- [ ] Viết logic Hover effect cho nút.
- [ ] Viết hàm Intercept Click: Chạy animation xúc tu trồi lên nhấn nút -> Resolve Promise -> Thực thi Click.

### Phase 5: Tối ưu & Chuẩn bị Deploy
- [ ] Kiểm tra responsive trên Safari/Chrome (macOS) và thiết bị di động.
- [ ] Cấu hình `vite.config.js` với `base` path phù hợp cho GitHub Pages.
- [ ] Chạy lệnh build kiểm tra thư mục `dist`.

---
**@Antigravity:** Đọc hiểu Directive này. Bắt đầu ngay Phase 1 và mở terminal thực thi lệnh cài đặt Vite, sau đó báo cáo lại cho Product Owner.