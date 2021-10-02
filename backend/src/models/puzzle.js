const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const puzzleSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, },
  creatorID: { type: String, required: true, trim: true }
  creatorName: { type: String, required: true, trim: true }
  level: { type: Number, required: true, default: 0, min: 0, max: 4 },
  columnCount: { type: Number, required: true, default: 30, min: 4, max: 40 },
  rowCount: { type: Number, required: true, default: 30, min: 4, max: 40 },
  cells: [Object],
  createdAt: { type: Date, required: true },
});

const puzzle = mongoose.model("puzzle", puzzleSchema);

module.exports = puzzle;
