import { Router } from 'express';
import RecipesController from '../controllers/recipesController'

const router = Router()

const recipesController = new RecipesController()

router.post('/', recipesController.addRecipe);
router.get('/', recipesController.getAllRecipe);
router.get('/:id', recipesController.getRecipeById);
router.patch('/:id', recipesController.updateRecipe)
router.delete('/:id', recipesController.deleteRecipe)

export default router