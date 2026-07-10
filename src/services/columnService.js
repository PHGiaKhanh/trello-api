import { columnModel } from '~/models/columnModel.js'
import { boardModel } from '~/models/boardModel.js'
import { cardModel } from '~/models/cardModel.js'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    //Xử lý logic dữ liệu
    const newColumn = {
      ...reqBody
    }

    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId.toString())

    if (getNewColumn) {
      //xu ly cau truc data truoc khi tra du lieu ve
      getNewColumn.cards = []

      //cap nhat manng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }
}

const update = async (columnId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (error) { throw error }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    console.log('targetColumn', targetColumn)
    if (!targetColumn) {
      throw new Error(StatusCodes.NOT_FOUND, `Column with id ${columnId} not found`)
    }
    //delete column
    await columnModel.deleteOneById(columnId)

    //delete card trong column tren
    await cardModel.deleteManyByColumnId(columnId)

    // delete columnId trong columnOrderIds cua board
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Column and its Cards deleted successfully' }
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}