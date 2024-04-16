const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  dishName: {
    type: String,
    required: true
  },
  shapes: {
    type: [String],
    required: true
  },
  ingredients: {
    type: Map,
    of: Number,
    required: true
  },
  calorieValue: {
    type: Number,
    default: null
  },
  cookingTime: {
    type: Number,
    default: true
  },
  price: {
    type: Number,
    required: null
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
