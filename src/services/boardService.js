import { slugify } from '~/utils/formatters.js'
import { boardModel } from '~/models/boardModel.js'


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

export const boardService = {
  createNew
}