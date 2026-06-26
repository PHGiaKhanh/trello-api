import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute.js'
import { cardRoute } from './cardRoute.js'
import { columnRoute } from './columnRoute.js'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use' })
})

//board APIs
Router.use('/boards', boardRoute)

//cards APIs
Router.use('/cards', cardRoute)

//columns APIs
Router.use('/columns', columnRoute)

export const APIs_V1 = Router