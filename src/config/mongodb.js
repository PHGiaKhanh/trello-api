/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */


import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment.js'
let trelloDatabaseInstance = null


//khởi tạo một đối tượng Client Instance để kết nối đến MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

//kết nối tới database
export const CONNECT_DB = async () => {
  //Gọi kết nối tới mongoDB atlas với URI đã khai báo trong thân của clientInstance
  await mongoClientInstance.connect()

  //kết nối thành công thì lấy database theo tên và gán ngược lại vào biến trelloDatabaseInstance ở trên
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) {
    throw new Error('Database not connected. Please call CONNECT_DB first.')
  }
  return trelloDatabaseInstance
}