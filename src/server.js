/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb.js'
import { env } from '~/config/environment.js'
import { APIs_V1 } from '~/routes/v1'

//khởi động server back-end sau khi Connect database thành công
const START_SERVER = async () => {
  const app = express()

  app.use(express.json())

  //Use API v1
  app.use('/v1', APIs_V1)


  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. HI ${env.AUTHOR}, BE is running at http://${ env.APP_HOST }:${ env.APP_PORT }/`)
  })

  exitHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB. Exiting process.')
  })
}

(async () => {
  try {
    console.log('1. Starting server...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB')

    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  }
})()
// //khi kết nối thành công tới database thì mới Start server back-end lên
// console.log('1. Connecting to MongoDB...')
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB') )
//   .then(() => START_SERVER() )
//   .catch(error => {
//     console.error('Error connecting to MongoDB:', error)
//     process.exit(0)
//   })

