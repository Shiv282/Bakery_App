const Inventory = require('../models/Inventory');

// Method to get inventory items
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Method to get inventory items by itemname
exports.getInventoryByItem = async (req, res) => {
    try {
      const { item } = req.params;
      const inventory = await Inventory.find({ item: { $regex: new RegExp(item, "i") } });
      res.json(inventory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // Method to get inventory items by mainType
exports.getInventoryByMainType = async (req, res) => {
    try {
      const { mainType } = req.params;
      const inventory = await Inventory.find({ mainType });
      res.json(inventory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  

// Method to create a new inventory item
exports.createInventoryItem = async (req, res) => {
    try {
      const { item, mainType, quantity, price, calorificValue } = req.body;
  
      // Create a new inventory item
      const newItem = new Inventory({
        item,
        mainType,
        quantity,
        price,
        calorificValue
      });
  
      // Save the new item to the database
      const savedItem = await newItem.save();
  
      res.status(201).json(savedItem); // Respond with the created item
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Method to reduce item quantity
exports.reduceQuantity = async (req, res) => {
    try {
      const { id } = req.params;
      let { quantity } = req.body;
  
      // Convert quantity to a number
      quantity = parseInt(quantity);
  
      const inventoryItem = await Inventory.findById(id);
      if (!inventoryItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      const actualAmount = inventoryItem.quantity;
      if (actualAmount >= quantity) {
        inventoryItem.quantity -= quantity;
        await inventoryItem.save();
  
        res.json({ message: 'Item quantity reduced successfully' });
      } else {
        res.json({ message: 'Item quantity is lesser than requested' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  



 // Method to update inventory item quantity by name
// Method to update inventory item quantity by name
exports.updateInventoryQuantityByName = async (req, res) => {
    try {
      const { itemName } = req.params;
      let { quantity } = req.query;
  
      // Convert quantity to a number
      quantity = parseInt(quantity);
  
      console.log('itemName:', itemName);
      console.log('quantity:', quantity);
  
      const inventoryItem = await Inventory.findOne({ item: itemName });
      console.log('inventoryItem:', inventoryItem);
  
      if (!inventoryItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Update the item quantity
      inventoryItem.quantity = quantity;
      await inventoryItem.save();
  
      res.json({ message: 'Item quantity updated successfully' });
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ message: err.message });
    }
  };
  
  
// Method to delete an inventory item by name
exports.deleteItem = async (req, res) => {
    try {
      const { itemName } = req.params;
  
      // Find the inventory item by name and delete it
      const deletedItem = await Inventory.findOneAndDelete({ name: itemName });
  
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.json({ message: 'Item deleted successfully', deletedItem });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
