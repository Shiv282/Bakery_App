const Recipe = require('../../models/Recipes');
const Inventory = require('../../models/Inventory'); 


exports.findOptimalRecipeCombinations = async (inventoryQuantities,recipes) => {
    try {
        
        // Convert inventory items into an object with item name as key and quantity as value
        
        // Initialize variables to store the best combination and its total price
        let bestCombination = {};
        let maxTotalPrice = 0;
        // Recursive function to generate all combinations of recipes
        const generateCombinations = (currentIndex, currentCombination, remainingInventory, targetPrice) => {
            // Base case: if all recipes have been considered
            if (currentIndex === recipes.length) {
                // If the current combination has a higher total price than the best combination, update the best combination and max total price
                if (targetPrice > maxTotalPrice) {
                    bestCombination = { ...currentCombination };
                    maxTotalPrice = targetPrice;
                }
                return;
            }
            // Try adding the current recipe to the combination starting from 0 times up to the maximum possible times
            const currentRecipe = recipes[currentIndex];
            const maxTimesToAdd = calculateMaxTimesToAdd(currentRecipe.ingredients, remainingInventory);
            // Try adding the current recipe 0 to maxTimesToAdd times
            for (let timesToAdd = 0; timesToAdd <= maxTimesToAdd; timesToAdd++) {
                // Check if adding the recipe is feasible based on ingredient quantities
                let canAddRecipe = true;
                for (const [ingredient, quantity] of currentRecipe.ingredients) {
                    if (!remainingInventory[ingredient] || remainingInventory[ingredient] < quantity * timesToAdd) {
                        canAddRecipe = false;
                        break;
                    }
                }
                // If adding the recipe is feasible, deduct the required quantities of ingredients
                if (canAddRecipe) {
                    const updatedInventory = { ...remainingInventory };
                    for (const [ingredient, quantity] of currentRecipe.ingredients) {
                        updatedInventory[ingredient] -= quantity * timesToAdd;
                    }
                    // Add the current recipe to the current combination
                    currentCombination[currentRecipe.dishName] = timesToAdd;
                    // Recur with the next recipe and updated target price
                    generateCombinations(currentIndex + 1, currentCombination, updatedInventory, targetPrice + (currentRecipe.price * timesToAdd));
                    // Remove the current recipe from the current combination after backtracking
                    delete currentCombination[currentRecipe.dishName];
                    // Add back the required quantities of ingredients
                    for (const [ingredient, quantity] of currentRecipe.ingredients) {
                        updatedInventory[ingredient] += quantity * timesToAdd;
                    }
                }
            }
            // Recur without adding the current recipe
            generateCombinations(currentIndex + 1, currentCombination, remainingInventory, targetPrice);
        };
        // Start generating combinations recursively
        generateCombinations(0, {}, inventoryQuantities, 0);
        // Return the best combination and max total price
        console.log(bestCombination);
        return { bestCombination, maxTotalPrice };
    } catch (error) {
        console.error('Error finding optimal recipe combinations:', error);
        return { error: 'Internal server error' };
    }
};

// Function to calculate the maximum number of times a recipe can be added to the combination
function calculateMaxTimesToAdd(ingredientsRequired, remainingInventory) {
    let maxTimesToAdd = Infinity;
    for (const [ingredient, quantity] of ingredientsRequired) {
        
        const maxTimesForIngredient = Math.floor(remainingInventory[ingredient] / quantity);
        maxTimesToAdd = Math.min(maxTimesToAdd, maxTimesForIngredient);
    }
    return maxTimesToAdd;
}