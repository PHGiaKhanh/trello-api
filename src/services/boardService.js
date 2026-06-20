import { slugify } from '~/utils/formatters.js'
import { boardModel } from '~/models/boardModel.js'
import { ApiError } from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    //Xử lý logic dữ liệu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi đến hàm createNew trong BoardModel để tạo bảng mới trong Database
    const createdBoard = await boardModel.createNew(newBoard)

    //lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId.toString())
    return getNewBoard
  } catch (error) { throw error }
}

const getDetails = async (boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    return board
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetails
}