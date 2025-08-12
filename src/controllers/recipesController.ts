import { Request, Response } from 'express';
import RecipeService from '../services/recipesService';
import Recipe from '../models/recipe';

class RecipesController {

    async getRecipeById(req: Request, res: Response): Promise<void> {
        const recipeId = Number(req?.params?.id);
        const recipeService = new RecipeService()
        try {
            const recipe = await recipeService.getRecipeById(recipeId)
            res.status(200).json([recipe])
        } catch (error) {
            throw error
        }
    }

    async getAllRecipe(req: Request, res: Response): Promise<void> {
        const recipeService = new RecipeService()
        try {
            const recipes = await recipeService.getAllRecipe()
            res.status(200).json([recipes])
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
                createdAt: request.created_at,
                UpdatedAt: request.updated_at
            }
            
            await recipeService.addRecipe(recipe)

            res.status(200)
        } catch (error) {
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

            res.status(200).json(updatedRecipe)
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