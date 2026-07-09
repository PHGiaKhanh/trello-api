import { slugify } from '~/utils/formatters.js'
import { boardModel } from '~/models/boardModel.js'
import { cardModel } from '~/models/cardModel.js'
import { ApiError } from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel.js'

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
      //column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
      // cách 2: hàm equals trong mongDB
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    //Xóa card khỏi board ban đầu
    delete resBoard.cards
    return resBoard
  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) { throw error }
}

const moveCardToAnotherColumn = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
  //Khi di chuyển card sang col khác
  //B1: Cập nhật mảng cardOrderIds của col chứa card cũ (sourceColumnId)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    } )
    //B2: Cập nhật mảng cardOrderIds của col chứa card mới (destinationColumnId)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    } )
    //B3: Cập nhật columnId mới của Card đã kéo-> vieets API riêng
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    } )
    return { updateResult: 'Successfully!' }
  } catch (error) { throw error }
}


export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToAnotherColumn
}