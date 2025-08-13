import Recipe from "../models/recipe";
import pool from "../db/mysql";
import { RowDataPacket } from "mysql2/promise";
import RecipeNotFoundError from "../errors/recipeNotFoudError";

class RecipeDto {
  async getRecipeById(recipeId: number): Promise<Recipe> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM recipes WHERE id = ?', [recipeId]);
    if (rows.length === 0) {
      throw new RecipeNotFoundError(`Cannot find recipeId ${recipeId}`)
    }

    const recipe: Recipe = {
      id: rows[0].id,
      title: rows[0].title,
      makingTime: rows[0].making_time,
      serves: rows[0].serves,
      ingredients: rows[0].ingredients,
      cost: rows[0].cost,
      createdAt: rows[0].created_at,
      UpdatedAt: rows[0].updated_at
    }

    return recipe
  }

  async getAllRecipe(): Promise<Recipe[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM recipes');

    const recipes:Recipe[] = []
        
    for(const row of rows) {
      const recipe: Recipe = {
        id: row.id,
        title: row.title,
        makingTime: row.making_time,
        serves: row.serves,
        ingredients: row.ingredients,
        cost: row.cost,
        createdAt: row.created_at,
        UpdatedAt: row.updated_at
      }

      recipes.push(recipe)
    }
    return recipes
  }

  async addRecipe(recipe: Recipe): Promise<Recipe> {

    await pool.query("START TRANSACTION")

    let newRecipe: Recipe

    try {
      await pool.query("INSERT INTO recipes (title, making_time, serves, ingredients, cost) VALUES (?, ?, ?, ?, ?)", [recipe.title, recipe.makingTime, recipe.serves, recipe.ingredients, recipe.cost])

      const [rows] = await pool.query('SELECT * FROM recipes WHERE id = LAST_INSERT_ID()');
      newRecipe = {
        id: rows[0].id,
        title: rows[0].title,
        makingTime: rows[0].making_time,
        serves: rows[0].serves,
        ingredients: rows[0].ingredients,
        cost: rows[0].cost,
        createdAt: rows[0].created_at,
        UpdatedAt: rows[0].updated_at
      }

      await pool.query("COMMIT")
    } catch(error) {
      await pool.query("ROLLBACK")
      throw error
    }

    return newRecipe
  }

  async updateRecipe(recipe: Recipe): Promise<Recipe> {
        
    await pool.query("START TRANSACTION")
    let newVersionRecipe:Recipe

    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM recipes WHERE id= ?', [recipe.id]);
      if (rows.length === 0) {
        throw new RecipeNotFoundError(`Message not found during update for recipeId ${recipe.id}`)
      }

      const updatedRecipe: Recipe = {
        id: rows[0].id,
        title: recipe.title ?? rows[0].title,
        makingTime: recipe.makingTime ?? rows[0].making_time,
        serves: recipe.serves ?? rows[0].serves,
        ingredients: recipe.ingredients ?? rows[0].ingredients,
        cost: recipe.cost ?? rows[0].cost
      }

      await pool.query("UPDATE recipes SET title = ?, making_time = ?, serves = ?, ingredients = ?, cost = ? WHERE id = ?", [updatedRecipe.title, updatedRecipe.makingTime, updatedRecipe.serves, updatedRecipe.ingredients, updatedRecipe.cost, updatedRecipe.id])

      const [updatedRows] = await pool.query('SELECT * FROM recipes WHERE id= ?', [recipe.id]);

      newVersionRecipe = {
        id: updatedRows[0].id,
        title: updatedRows[0].title,
        makingTime: updatedRows[0].making_time,
        serves: updatedRows[0].serves,
        ingredients: updatedRows[0].ingredients,
        cost: updatedRows[0].cost,
        createdAt: updatedRows[0].created_at,
        UpdatedAt: updatedRows[0].updated_at
      }

      await pool.query("COMMIT")
    } catch(error) {
      await pool.query("ROLLBACK")
      throw error
    }

    return newVersionRecipe
  }

  async deleteRecipe(recipeId: number): Promise<void> {
    await pool.query("START TRANSACTION")

    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM recipes WHERE id= ?', [recipeId]);
      if (rows.length === 0) {
        throw new RecipeNotFoundError(`Message not found during delete for recipeId ${recipeId}`)
      }
      await pool.query("DELETE FROM recipes WHERE id = ?", [recipeId])

      await pool.query("COMMIT")
    } catch(error) {
      await pool.query("ROLLBACK")
      throw error
    }
  }

}

export default RecipeDto