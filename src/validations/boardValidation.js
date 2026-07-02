import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must be at most 50 characters long',
      'string.trim': 'Title cannot have leading or trailing whitespace'
      //ghi đè lên message của joi thành như trên (custome message)
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })
  try {

    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //validate dữ liệu xong và hợp lệ thì cho req sang Controller
    next()
  } catch (error) {
    // const errorMessages = new Error(error).message
    // const customeError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages)
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  //không dùng required() trog trường hợp update
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
  })

  try {
    await correctCondition.validateAsync(req.body, { 
      abortEarly: false,
      allowUnknown: true //cho phép các trường khác ngoài title, description, type
    })
    //validate dữ liệu xong và hợp lệ thì cho req sang Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew,
  update
}