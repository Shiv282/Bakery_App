const mongoose = require('mongoose');

const shapeSchema = new mongoose.Schema({
  shapeName: {
    type: String,
    required: true
  },
  addonsList: {
    type: [String],
    required: true
  },
  timeDuration: {
    type: Number,
    required: true
  },
  priceForShape: {
    type: Number,
    required: true
  }
});

const Shape = mongoose.model('Shape', shapeSchema);

module.exports = Shape;
