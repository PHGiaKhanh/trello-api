
# Trello API

API backend cho Trello clone, xây dựng bằng Node.js, Express và MongoDB. Dự án này là phần backend của bộ source `react-web` / `trello-api`, dùng để quản lý boards, columns và cards theo đúng luồng kéo thả của Trello.

## Requirements

```text
nodejs >= 18.16.0
npm = v9.8.1
yarn = v1.22.19

express: ^4.18.2
nodemon: ^3.0.1
eslint: ^8.47.0

@babel/runtime: ^7.22.10
@babel/cli: ^7.22.10
@babel/core: ^7.22.10
@babel/eslint-parser: ^7.22.10
@babel/node: ^7.22.10
@babel/plugin-transform-runtime: ^7.22.10
@babel/preset-env: ^7.22.10
babel-plugin-module-resolver: ^5.0.0
```

## Giới thiệu nhanh

Server khởi động tại [src/server.js](src/server.js), kết nối MongoDB trước rồi mới mở HTTP server. Toàn bộ API hiện tại được mount dưới prefix `/v1` thông qua [src/routes/v1/index.js](src/routes/v1/index.js).

Ứng dụng có 3 nhóm dữ liệu chính:

- Boards: lưu board, thứ tự column và metadata chung.
- Columns: lưu column, thứ tự card trong column.
- Cards: lưu card và liên kết tới board/column.

## Cấu trúc thư mục chính

- [src/config](src/config) - cấu hình môi trường, MongoDB và CORS.
- [src/controllers](src/controllers) - layer nhận request và trả response.
- [src/services](src/services) - xử lý logic nghiệp vụ.
- [src/models](src/models) - thao tác database với MongoDB.
- [src/routes](src/routes) - khai báo endpoint.
- [src/validations](src/validations) - validate request bằng Joi.
- [src/utils](src/utils) - hằng số, formatter, helper, lỗi dùng chung.

## Biến môi trường

Tạo file `.env` từ [.env.example](.env.example) và cấu hình các biến sau:

```text
MONGODB_URI=
DATABASE_NAME=
BUILD_MODE=dev
AUTHOR=
LOCAL_DEV_APP_HOST=localhost
LOCAL_DEV_APP_PORT=8017
```

Lưu ý: `BUILD_MODE=dev` cho phép CORS mở rộng trong môi trường local. Khi production, CORS chỉ cho phép domain nằm trong whitelist ở [src/utils/constants.js](src/utils/constants.js).

## Scripts

Các script có trong [package.json](package.json):

- `npm run dev` - chạy backend ở chế độ development với `babel-node` và `nodemon`.
- `npm run build` - clean thư mục `build` và transpile source từ `src` sang `build/src`.
- `npm run production` - build rồi chạy file đã transpile trong `build/src/server.js`.
- `npm run lint` - kiểm tra code bằng ESLint.


### Boards

- `GET /v1/boards` - placeholder response kiểm tra route.
- `POST /v1/boards` - tạo board mới.
- `GET /v1/boards/:id` - lấy chi tiết board, bao gồm columns và cards đã được nest đúng theo column.
- `PUT /v1/boards/:id` - cập nhật board.
- `PUT /v1/boards/supports/moving_cards` - cập nhật dữ liệu khi kéo thả card giữa các column.


### Cards

- `POST /v1/cards` - tạo card mới và tự thêm card vào `cardOrderIds` của column.


### Columns

- `POST /v1/columns` - tạo column mới và tự cập nhật `columnOrderIds` của board.
- `PUT /v1/columns/:id` - cập nhật column.
- `DELETE /v1/columns/:id` - xóa column và toàn bộ cards thuộc column đó.


## Validation rules chính

- Board tạo mới yêu cầu `title`, `description`, `type` với `type` chỉ nhận `public` hoặc `private`.
- Column tạo mới yêu cầu `boardId` và `title`.
- Card tạo mới yêu cầu `boardId`, `columnId` và `title`.
- Các id dùng trong API phải là MongoDB ObjectId hợp lệ.

## Data flow

1. Request vào route.
2. Validation kiểm tra payload bằng Joi.
3. Controller gọi service.
4. Service xử lý logic và gọi model.
5. Model thao tác MongoDB.

## Ghi chú

- Khi chạy production, server dùng `process.env.PORT`.
- Khi chạy local, server dùng `LOCAL_DEV_APP_HOST` và `LOCAL_DEV_APP_PORT`.

