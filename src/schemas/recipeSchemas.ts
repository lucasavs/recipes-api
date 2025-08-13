import Joi from 'joi'

export const createRecipeSchema = Joi.object({
  title: Joi.string().max(100).required(),
  makingTime: Joi.string().max(100).required(),
  serves: Joi.string().max(100).required(),
  ingredients: Joi.string().max(300).required(),
  cost: Joi.number().integer().required()
})