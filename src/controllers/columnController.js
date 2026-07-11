import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService.js'

const createNew = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Service
    const createdColumn = await columnService.createNew(req.body)
    //Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const columnId = req.params.id

    const updatedColumn = await columnService.update(columnId, req.body)
    //throw new ApiError(StatusCodes.BAD_GATEWAY, 'khanh test error')
    //Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) { next(error) }
}

const deleteItem = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const resultDelete = await columnService.deleteItem(columnId)

    res.status(StatusCodes.OK).json(resultDelete)
  } catch (error) { next(error) }
}

export const columnController = {
  createNew,
  update,
  deleteItem
}