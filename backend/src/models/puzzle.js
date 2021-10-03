const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const puzzleSchema = mongoose.Schema({
  cellString: { type: String, required: true, trim: true, unique: true },
  columnCount: { type: Number, required: true, default: 30, min: 4, max: 40 },
  createdAt: { type: Date, required: true },
  creatorID: { type: String, required: true, trim: true },
  creatorName: { type: String, required: true, trim: true },
  level: { type: Number, required: true, default: 0, min: 0, max: 4 },
  name: { type: String, required: true, trim: true },
  rowCount: { type: Number, required: true, default: 30, min: 4, max: 40 },
});

const puzzle = mongoose.model('puzzle', puzzleSchema);

module.exports = puzzle;
