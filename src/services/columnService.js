import { columnModel } from '~/models/columnModel.js'

const createNew = async (reqBody) => {
  try {
    //Xử lý logic dữ liệu
    const newColumn = {
      ...reqBody
    }

    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId.toString())
    return getNewColumn
  } catch (error) { throw error }
}

export const columnService = {
  createNew
}