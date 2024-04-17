const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    dish: {
        type: String,
        required: true
    },
    shape: {
        type: String,
        required: true
    },
    addons: [String],
    noOfPieces: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    totalPrice: Number,
    totalCalorificValue: Number,
    finalCookingTime: Number

});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;