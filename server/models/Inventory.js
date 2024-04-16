const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  item: String,
  mainType: Boolean,
  quantity: Number,
  price : Number,
  calorificValue: Number
});
// Both quantity and price are per gram.
//calorifiv Value is kcal per gram?
const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
