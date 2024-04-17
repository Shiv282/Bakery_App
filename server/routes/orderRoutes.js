const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Add routes for orders
router.post('/', orderController.addOrder);
router.post('/array', orderController.addOrderArray);


router.get('/byOrderId/:orderId', orderController.getOrdersByOrderId);
router.get('/byTimestamp', orderController.getOrdersByTimestamp);
router.get('/all', orderController.getAllOrders);

module.exports = router;