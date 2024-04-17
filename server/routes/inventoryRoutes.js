const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getInventory);

//route to get inventory items by item name
router.get('/item/:item', inventoryController.getInventoryByItem);
//route to get inventory items by mainType
router.get('/mainType/:mainType', inventoryController.getInventoryByMainType);





router.post('/', inventoryController.createInventoryItem);


//update
router.patch('/reduce/:id', inventoryController.reduceQuantity);
 //route for updating or replenishing quantity
//router.patch('/:id', inventoryController.replenishInventoryQuantity);


// Route to update inventory item quantity by name
router.patch('/update/:itemName', inventoryController.updateInventoryQuantityByName);


//delete
//Route to delete inventory item by name
router.delete('/:itemName', inventoryController.deleteItem);


module.exports = router;
