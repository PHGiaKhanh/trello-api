import express from 'express'
import cors from 'cors'
import { corsOptions} from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb.js'
import { env } from '~/config/environment.js'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware.js'
//khởi động server back-end sau khi Connect database thành công
const START_SERVER = async () => {
  const app = express()

  //Xử lý CORS
  app.use(cors(corsOptions))

  app.use(express.json())

  //Use API v1
  app.use('/v1', APIs_V1)

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)


  if (env.BUILD_MODE === 'production') {
    // môi trường production ( hiện tại đang support trên Render.com )
    app.listen(process.env.PORT, () => {
      console.log(`3. Production : HI ${env.AUTHOR}, BE is running at http://${process.env.PORT}/`)
    })
  } else {
    // môi trường dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`3. Local DEV : HI ${env.AUTHOR}, BE is running at http://${ env.LOCAL_DEV_APP_HOST }:${ env.LOCAL_DEV_APP_PORT }/`)
    })
  }


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

