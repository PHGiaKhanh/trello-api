//những domain được phép truy cập tài nguyên ở local
export const WHITELIST_DOMAINS = [
  //'http://localhost:5173'
  // không cần localhost nữa vì mình đã config/cors luôn cho phép môi trường dev
  'https://react-web-xi-three.vercel.app'
]


export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}