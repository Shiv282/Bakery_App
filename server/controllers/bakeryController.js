const Shape = require('../models/Shapes');
const Recipe = require('../models/Recipes');
const Inventory = require('../models/Inventory'); 



// Method to add a new recipe
exports.addRecipe = async (req, res) => {
  try {
    const { dishName, shapes, ingredients, cookingTime } = req.body;

    // Calculate price and calorific value based on ingredients
    const { price, calorificValue } = await calculatePriceAndCalories(ingredients);

    const newRecipe = new Recipe({
      dishName,
      shapes,
      ingredients,
      cookingTime,
      calorieValue: calorificValue,
      price: price
    });

    const savedRecipe = await newRecipe.save();

    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Method to calculate price and calorific value based on ingredients
async function calculatePriceAndCalories(ingredients) {
  let totalPrice = 0;
  let totalCalories = 0;

  for (const [item, quantity] of Object.entries(ingredients)) {
    const itemInfo = await Inventory.findOne({ name: item });
    if (itemInfo) {
      totalPrice += itemInfo.price * quantity;
      totalCalories += itemInfo.calorificValue * quantity;
    }
  }

  return { price: totalPrice, calorificValue: totalCalories };
}

// Method to add a new shape
exports.addShape = async (req, res) => {
  try {
    const { shapeName, addonsList, timeDuration, priceForShape } = req.body;

    const newShape = new Shape({
      shapeName,
      addonsList,
      timeDuration,
      priceForShape
    });

    const savedShape = await newShape.save();

    res.status(201).json(savedShape);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Method to update addons list for a shape
exports.updateAddonsList = async (req, res) => {
  try {
    const { id } = req.params;
    const { addonsList } = req.body;

    const shape = await Shape.findById(id);
    if (!shape) {
      return res.status(404).json({ message: 'Shape not found' });
    }

    shape.addonsList = addonsList;
    const updatedShape = await shape.save();

    res.json(updatedShape);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Method to get all shapes
exports.getShapes = async (req, res) => {
  try {



    const shapes = await Shape.find();
    res.json(shapes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Method to get shape by shape name
exports.getShapeByName = async (req, res) => {
  try {
    const { shapeName } = req.params;
    const shape = await Shape.findOne({ shapeName });
    if (!shape) {
      return res.status(404).json({ message: 'Shape not found' });
    }
    res.json(shape);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Method to get shape by ID
exports.getShapeById = async (req, res) => {
  try {
    const { id } = req.params;
    const shape = await Shape.findById(id);
    if (!shape) {
      return res.status(404).json({ message: 'Shape not found' });
    }
    res.json(shape);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//RECIPES

// Method to get all recipes
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Method to get recipes by dish name
exports.getRecipesByDishName = async (req, res) => {
  const { dishName } = req.params;
  try {
    const recipes = await Recipe.find({ dishName });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Method to update ingredients list by dish name
exports.updateIngredientsList = async (req, res) => {
  const { dishName } = req.params;
  const { ingredients } = req.body;
  try {
    const recipe = await Recipe.findOneAndUpdate({ dishName }, { ingredients }, { new: true });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Method to delete recipe by dish name
exports.deleteRecipe = async (req, res) => {
  const { dishName } = req.params;
  try {
    const recipe = await Recipe.findOneAndDelete({ dishName });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Method to add a new recipe
exports.addRecipe = async (req, res) => {
  try {
    const { dishName, shapes, ingredients, cookingTime } = req.body;

    // Calculate price and calorific value based on ingredients
    const { price, calorificValue } = await calculatePriceAndCalories(ingredients);

    const newRecipe = new Recipe({
      dishName,
      shapes,
      ingredients,
      cookingTime,
      calorieValue: calorificValue,
      price: price
    });

    const savedRecipe = await newRecipe.save();

    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Method to calculate price and calorific value based on ingredients in the recipe list and the values of it in the Inventory Collection
async function calculatePriceAndCalories(ingredients) {
    let totalPrice = 0;
    let totalCalories = 0;
  
    for (const [item, quantity] of Object.entries(ingredients)) {
      try {
        const cleanedItem = item.trim(); // Remove leading and trailing spaces
        const itemInfo = await Inventory.findOne({ item: { $regex: new RegExp(cleanedItem, 'i') } });
        if (!itemInfo) {
          console.log("No inventory item found for ${item}");
        } else {
          totalPrice += itemInfo.price * quantity;
          totalCalories += itemInfo.calorificValue * quantity;
        }
      } catch (err) {
        console.error('Error finding inventory item for ${item}: ${err.message}');
      }
    }
  
    return { price: totalPrice, calorificValue: totalCalories };
  };
  
 


  exports.calculateMaxExploitation = async (req, res) => {
    try {
        // Retrieve all recipes from the database
        const recipes = await Recipe.find();
        // Retrieve all inventory items from the database
        const inventoryItems = await Inventory.find();
        // Initialize a map to store the maximum number of times each recipe can be made
        const maxRecipeCounts = new Map();

        // Iterate through each recipe and calculate the maximum number of times it can be made
        for (const recipe of recipes) {
            let maxCount = Infinity; // Set initial max count to infinity
            
            // Iterate through each ingredient in the recipe
            for (const [ingredient, quantity] of recipe.ingredients.entries()) {
                // Find the corresponding inventory item
                const inventoryItem = inventoryItems.find(invItem => invItem.item.toLowerCase() === ingredient.toLowerCase());
                // Calculate the maximum count based on available quantity
                if (inventoryItem) {
                    const count = Math.floor(inventoryItem.quantity / quantity);
                    if (count < maxCount) {
                        maxCount = count;
                    }
                } else {
                    // If any ingredient is missing, this recipe cannot be made
                    maxCount = 0;
                    break;
                }
            }

            // Store the maximum count for this recipe
            maxRecipeCounts.set(recipe.dishName, maxCount);
        }

        // Calculate the total number of dishes that can be made
        const totalDishes = Math.min(...Array.from(maxRecipeCounts.values()));

        // Initialize an object to store the quantity of each dish
        const dishQuantities = {};

        // Iterate through each recipe and calculate the quantity of each dish
        for (const [dishName, maxCount] of maxRecipeCounts.entries()) {
            dishQuantities[dishName] = maxCount * totalDishes;
        }

        // Calculate the total amount of inventory used
        let totalInventoryUsed = 0;
        for (const [dishName, quantity] of Object.entries(dishQuantities)) {
            const recipe = recipes.find(recipe => recipe.dishName === dishName);
            totalInventoryUsed += recipe.price * quantity;
        }

        console.log(totalDishes);
        console.log(dishQuantities);
        console.log(totalInventoryUsed);
        res.status(200).json({ totalDishes, dishQuantities, totalInventoryUsed });
        return { totalDishes, dishQuantities, totalInventoryUsed };

    } catch (err) {
        res.status(500).json({ message: err.message });
        throw new Error('Error calculating max exploitation of inventory: ${err.message}');
    }
};