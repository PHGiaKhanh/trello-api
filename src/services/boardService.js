import { slugify } from '~/utils/formatters.js'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    //Xử lý logic dữ liệu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Serviec bắt buộc có return về kết quả sau khi xử lý xong dữ liệu
    return newBoard
  } catch (error) {throw error}
}

export const boardService = {
  createNew
}