const Order = require('../models/Orders');
const Shape = require('../models/Shapes');

const Recipe = require('../models/Recipes');
const Inventory = require('../models/Inventory');


exports.addOrder = async (req, res) => {
    try {
        const { orderId, dish, shape, addons, noOfPieces, totalPrice, totalCalorificValue, finalCookingTime } = req.body;

  /*      // Fetch recipe details for the dish
       


        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Calculate total price for the dish
        let totalPrice = recipe.price;
       totalPrice += currentShape.priceForShape;

        // Fetch addon prices from inventory and calculate total price
        for (const addon of addons) {
            const inventoryItem = await Inventory.findOne({ item: { $regex: new RegExp(addon, 'i') }, mainType: false });

            if (inventoryItem) {
                totalPrice += inventoryItem.price * 10; // Assuming 10 gms of each addon
            }
        }
            totalPrice= totalPrice*noOfPieces;

        // Calculate total calorific value for the dish
        let totalCalorificValue = recipe.calorieValue || 0;

        // Fetch calorific values of addons from inventory and calculate total calorific value
        for (const addon of addons) {
            const inventoryItem = await Inventory.findOne({ item: { $regex: new RegExp(addon, 'i') }, mainType: false });

            if (inventoryItem) {
                totalCalorificValue += inventoryItem.calorificValue * 10; // Assuming 10 gms of each addon
            }
        }

        // Calculate final cooking time
        const shapeDetails = await Shape.findOne({ shapeName: { $regex: new RegExp(shape, 'i') } });
        const finalCookingTime = recipe.cookingTime + (shapeDetails ? shapeDetails.timeDuration : 0);
*/

const recipe = await Recipe.findOne({ dishName: { $regex: new RegExp(dish, 'i') } });

await reduceInventoryQuantities(recipe, addons,noOfPieces);
        // Create a new order object
        const order = new Order({
            orderId,
            dish,
            shape,
            addons,
            noOfPieces,
            totalPrice,
            totalCalorificValue,
            finalCookingTime
        });

        // Save the order to the database
        await order.save();

        res.status(201).json(order);
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addOrderArray = async (req, res) => {
    try {
        const orders = req.body; // Assuming req.body is an array of order objects

        // Iterate through each order object in the array
        for (const orderData of orders) {
            const { orderId, dish, shape, addons, noOfPieces, totalPrice, totalCalorificValue, finalCookingTime } = orderData;

            // Find the recipe for the current dish
            const recipe = await Recipe.findOne({ dishName: { $regex: new RegExp(dish, 'i') } });

            // Reduce inventory quantities based on the recipe and addons
            await reduceInventoryQuantities(recipe, addons, noOfPieces);

            // Create a new order object
            const order = new Order({
                orderId,
                dish,
                shape,
                addons,
                noOfPieces,
                totalPrice,
                totalCalorificValue,
                finalCookingTime
            });

            // Save the order to the database
            await order.save();
        }

        res.status(201).json({ message: 'Orders added successfully' });
    } catch (error) {
        console.error('Error adding orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get orders by orderId
exports.getOrdersByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find orders with the specified orderId
        const orders = await Order.find({ orderId });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting orders by orderId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get orders by timestamp
exports.getOrdersByTimestamp = async (req, res) => {
    try {
        // Find orders sorted by timestamp in descending order
        const orders = await Order.find().sort({ timestamp: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting orders by timestamp:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        // Find all orders
        const orders = await Order.find();

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting all orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// method to reduce the inventory when an order is placed by the user.
const reduceInventoryQuantities = async (recipe, addonsList, noOfPieces) => {
    try {
        const recipeIngredients = recipe.ingredients;

        // Reduce quantity of recipe ingredients
        for (const [ingredient, quantity] of recipeIngredients) {
            const updateResult = await Inventory.updateOne(
                { item: { $regex: new RegExp('^' + ingredient, 'i') } }, 
                { $inc: { quantity: -(quantity * noOfPieces) } }
            );
            if (updateResult.nModified === 0) {
                console.warn(`No inventory item found for`);
            }
        }

        // Reduce quantity of addons
        for (const addon of addonsList) {
            const updateResult = await Inventory.updateOne(
                { item: { $regex: new RegExp('^' + addon, 'i') }, mainType: false }, 
                { $inc: { quantity: -(10 * noOfPieces) } }
            );
            if (updateResult.nModified === 0) {
                console.warn(`No inventory item found for addon `);
            }
        }
    } catch (error) {
        console.error('Error reducing inventory quantities:', error);
        throw error; // Propagate the error to handle it in the calling function
    }
};