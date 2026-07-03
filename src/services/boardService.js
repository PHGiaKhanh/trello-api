import { slugify } from '~/utils/formatters.js'
import { boardModel } from '~/models/boardModel.js'
import { ApiError } from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
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
    //Clone board ra 1 cái mới để xử lý, không ảnh hưởng board ban đầu
    const resBoard = cloneDeep(board)
    //Đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      //cách 1: dùng toString() của javascript
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
      // cáh 2: hàm equals trong mongDB
      //column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    //Xóa card khỏi board ban đầu
    delete resBoard.cards
    return resBoard
  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateBoard = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateBoard)
    return updatedBoard
  } catch (error) { throw error }
}


export const boardService = {
  createNew,
  getDetails,
  update
}