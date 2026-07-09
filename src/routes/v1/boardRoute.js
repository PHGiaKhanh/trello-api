import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation.js'
import { boardController } from '~/controllers/boardController.js'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list' })
  })
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)

//API hỗ trợ xử lý việc kéo thả card giữa các column
Router.route('/supports/moving_cards')
  .put(boardValidation.moveCardToAnotherColumnAPI, boardController.moveCardToAnotherColumn)


export const boardRoute = Router