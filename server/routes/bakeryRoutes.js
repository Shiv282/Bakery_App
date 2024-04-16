const express = require('express');
const router = express.Router();

const bakeryController = require('../controllers/bakeryController');

router.get('/shapes/:id', bakeryController.getShapeById);
router.get('/shapes/name/:shapeName', bakeryController.getShapeByName);

router.get('/shapes', bakeryController.getShapes);


router.patch('/shapes/:id', bakeryController.updateAddonsList);
router.post('/shapes', bakeryController.addShape);




//FOR RECIPES

router.get('/recipes', bakeryController.getRecipes);
router.get('/recipes/:dishName', bakeryController.getRecipesByDishName);
router.post('/recipes', bakeryController.addRecipe);
router.patch('/recipes/:dishName', bakeryController.updateIngredientsList);
router.delete('/recipes/delete/:dishName', bakeryController.deleteRecipe);


router.get('/recipes/abc', bakeryController.abc);
module.exports = router;

