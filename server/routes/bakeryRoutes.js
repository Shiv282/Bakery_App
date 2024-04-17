const express = require('express');
const router = express.Router();

const bakeryController = require('../controllers/bakeryController');
const Recipe = require('../models/Recipes');
const Inventory = require('../models/Inventory'); 

const pricebased = require('../controllers/services/pricebased')





router.get('/shapes/:id', bakeryController.getShapeById);
router.get('/shapes/name/:shapeName', bakeryController.getShapeByName);

router.get('/shapes', bakeryController.getShapes);

router.patch('/shapes/:id', bakeryController.updateAddonsList);
router.post('/shapes', bakeryController.addShape);




//FOR RECIPES
//router.get('/recipes/abc', bakeryController.calculateMaxExploitation);

router.get('/recipes', bakeryController.getRecipes);
router.get('/recipes/:dishName', bakeryController.getRecipesByDishName);
router.post('/recipes', bakeryController.addRecipe);
router.patch('/recipes/:dishName', bakeryController.updateIngredientsList);
router.delete('/recipes/delete/:dishName', bakeryController.deleteRecipe);



// Route to find the best combination of recipes based on inventory
router.get('/combination', async (req, res) => {
    try {
        // Fetch all recipes and inventory items from the database
        const recipes = await Recipe.find({});
        const inventoryItems = await Inventory.find({});

        // Convert inventory items into an array of key-value pairs
       // const inventoryArray = inventoryItems.map(item => ({ [item.item]: item.quantity }));

        // Call getBestCombination function with recipes and inventory as arguments
        const bestCombination = await getBestCombination(inventoryItems, recipes);

        // Send the best combination as the response
        res.status(200).json(bestCombination);
    } catch (error) {
        console.error('Error finding best combination:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/pricebased', async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        const inventoryItems = await Inventory.find({});
        const inventoryQuantities = {};
        inventoryItems.forEach(item => {
            inventoryQuantities[item.item] = item.quantity;
        });

        const { bestCombination, maxTotalPrice, error } = await pricebased.findOptimalRecipeCombinations(inventoryQuantities,recipes);
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ bestCombination, maxTotalPrice });

    } catch (error) {
        console.error('Error finding optimal recipe combinations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/userInput', async (req, res) => {
    try {
        const inventoryQuantities = req.body;
        const recipes = await Recipe.find({});
        console.log('body');
       console.log(req.body);

        const { bestCombination, maxTotalPrice, error } = await pricebased.findOptimalRecipeCombinations(inventoryQuantities,recipes);
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ bestCombination, maxTotalPrice });

    } catch (error) {
        console.error('Error finding optimal recipe combinations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;