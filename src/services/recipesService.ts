import RecipeDto from "../dtos/recipeDto";
import RecipeMandatoryFieldsNotPresent from "../errors/recipeMandatoryFieldsNotPresent";
import Recipe from "../models/recipe";
import { createRecipeSchema } from "../schemas/recipeSchemas"

class RecipeService {

  private recipeDto: RecipeDto

  constructor() {
    this.recipeDto = new RecipeDto()
  }

  async getRecipeById(recipeId: number): Promise<Recipe> {
    const recipe = await this.recipeDto.getRecipeById(recipeId)
    return recipe
  }

  async getAllRecipe(): Promise<Recipe[]> {
    const recipes = await this.recipeDto.getAllRecipe()
    return recipes
  }

  async addRecipe(recipe: Recipe): Promise<Recipe> {

    const mandatoryFields = ["title", "makingTime", "serves", "ingredients", "cost"]
    const requiredFieldsNotPresent: string[] = []

    mandatoryFields.forEach((field) => {
      if (recipe[field] === undefined) {
        requiredFieldsNotPresent.push(field)
      }
    })

    if (requiredFieldsNotPresent.length > 0 ) {
      throw new RecipeMandatoryFieldsNotPresent("Recipe creation failed!", requiredFieldsNotPresent)
    }

    // redundant, but we can use in some contexts
    const { error } = createRecipeSchema.validate(recipe)
    if (error) {
      throw error
    }

    const createdRecipe = await this.recipeDto.addRecipe(recipe)

    return createdRecipe
  }

  async updateRecipe(recipe:Recipe): Promise<Recipe> {
    // todo: Add validation using JOI

    const updatedRecipe = await this.recipeDto.updateRecipe(recipe)
    return updatedRecipe
  }

  async deleteRecipe(recipeId: number): Promise<void> {
    await this.recipeDto.deleteRecipe(recipeId)
  }
}

export default RecipeService