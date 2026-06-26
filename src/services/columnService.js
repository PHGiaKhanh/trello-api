import { columnModel } from '~/models/columnModel.js'
import { boardModel } from '~/models/boardModel.js'

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

export const columnService = {
  createNew
}