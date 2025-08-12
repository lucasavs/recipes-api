import RecipeDto from "../dtos/recipeDto";
import Recipe from "../models/recipe";

class RecipeService {

    private recipeDto

    constructor() {
        this.recipeDto = new RecipeDto()
    }

    async getRecipeById(recipeId: number): Promise<Recipe | null> {
        const recipe = await this.recipeDto.getRecipeById(recipeId)
        return recipe
    }

    async getAllRecipe(): Promise<Recipe[]> {
        const recipes = await this.recipeDto.getAllRecipe()
        return recipes
    }

    async addRecipe(recipe: Recipe): Promise<void> {
        await this.recipeDto.addRecipe(recipe)
    }

    async updateRecipe(recipe:Recipe): Promise<Recipe> {
        const updatedRecipe = await this.recipeDto.updateRecipe(recipe)
        return updatedRecipe
    }

    async deleteRecipe(recipeId: number): Promise<void> {
        await this.recipeDto.deleteRecipe(recipeId)
    }
}

export default RecipeService