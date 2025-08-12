import { Request, Response } from 'express';
import RecipeService from '../services/recipesService';
import Recipe from '../models/recipe';
import RecipeMandatoryFieldsNotPresent from '../errors/recipeMandatoryFieldsNotPresent';

class RecipesController {

    async getRecipeById(req: Request, res: Response): Promise<void> {
        const recipeId = Number(req?.params?.id);
        const recipeService = new RecipeService()
        try {
            const recipe = await recipeService.getRecipeById(recipeId)
            
            const response = {
                message: "Recipe details by id",
                recipe: [{
                    id: recipe.id,
                    title: recipe.title,
                    making_time: recipe.makingTime,
                    serves: recipe.serves,
                    ingredients: recipe.ingredients,
                    cost: recipe.cost,
                }]
            }
            res.status(200).json(response)
        } catch (error) {
            throw error
        }
    }

    async getAllRecipe(req: Request, res: Response): Promise<void> {
        const recipeService = new RecipeService()
        try {
            const recipes = await recipeService.getAllRecipe()

            const response = {
                recipes: recipes.map((recipe) => ({
                    id: recipe.id,
                    title: recipe.title,
                    making_time: recipe.makingTime,
                    serves: recipe.serves,
                    ingredients: recipe.ingredients,
                    cost: recipe.cost
                }))
            }
            res.status(200).json(response)
        } catch (error) {
            throw error
        }
    }

    async addRecipe(req: Request, res: Response): Promise<void> {
        const recipeService = new RecipeService()
        try {
            const request = req.body

            const recipe: Recipe = {
                title: request.title,
                makingTime: request.making_time,
                serves: request.serves,
                ingredients: request.ingredients,
                cost: request.cost,
            }
            
            const createdRecipe = await recipeService.addRecipe(recipe)

            const response = {
                message: "Recipe successfully created!",
                recipe: [{
                    id: createdRecipe.id,
                    title: createdRecipe.title,
                    making_time: createdRecipe.makingTime,
                    serves: createdRecipe.serves,
                    ingredients: createdRecipe.ingredients,
                    cost: createdRecipe.cost,
                    created_at: createdRecipe.createdAt,
                    updated_at: createdRecipe.UpdatedAt
                }]
            }

            res.status(200).json(response)
        } catch (error) {
            if (error instanceof RecipeMandatoryFieldsNotPresent) {
                // workaround to publish the correct fields names accordingly with API specs
                // we can move this to a util folders or use JOI to handle schema validation
                const mandatoryFieldTranslator = {
                    title: "title",
                    makingTime: "making_time",
                    serves: "serves",
                    ingredients: "ingredients",
                    cost: "cost"
                }

                console.log(`mandatory fields ${error.mandatoryFields}`)

                res.status(400).json({
                    message:"Recipe creation failed!",
                    required: error.mandatoryFields.map((mandatoryField) => mandatoryFieldTranslator[mandatoryField])
                })
            }
            throw error
        }
    }

    async updateRecipe(req: Request, res: Response): Promise<void> {
        const recipeService = new RecipeService()
        try {
            const request = req.body

            const recipeId = Number(req?.params?.id);

            const recipe: Recipe = {
                id: recipeId,
                title: request.title,
                makingTime: request.making_time,
                serves: request.serves,
                ingredients: request.ingredients,
                cost: request.cost,
                createdAt: request.created_at,
                UpdatedAt: request.updated_at
            }
            
            const updatedRecipe = await recipeService.updateRecipe(recipe)

            const response = {
                message: "Recipe successfully updated!",
                recipe: [{
                    id: updatedRecipe.id,
                    title: updatedRecipe.title,
                    making_time: updatedRecipe.makingTime,
                    serves: updatedRecipe.serves,
                    ingredients: updatedRecipe.ingredients,
                    cost: updatedRecipe.cost,
                }]
            }

            res.status(200).json(response)
        } catch (error) {
            throw error
        }
    }

    async deleteRecipe(req: Request, res: Response): Promise<void> {
        const recipeService = new RecipeService()
        try {
            const recipeId = Number(req?.params?.id);
            await recipeService.deleteRecipe(recipeId)

            res.status(200)
        } catch (error) {
            throw error
        }
    }

}

export default RecipesController