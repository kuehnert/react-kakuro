const express = require('express');
const router = new express.Router();
// const auth = require('../middleware/auth');
const _ = require('lodash');
const Puzzle = require('../models/puzzle');
const debug = require('../utils/debug');
const auth = require('../middleware/auth');

// FETCH ALL
router.get('/puzzles', async (req, res) => {
  try {
    const puzzles = await Puzzle.find({}).sort('createdAt');
    res.send(puzzles);
  } catch (error) {
    res.sendStatus(500);
  }
});

// CREATE
router.post('/puzzles', auth, async (req, res) => {
  const values = req.body;

  const ALLOWED = ["name", "level", "columnCount", "rowCount", "cellString"];
  const updates = Object.keys(values);
  const isValid = updates.every(a => ALLOWED.includes(a));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid values" });
  }

  try {

  } catch (error) {
    console.log('error', error);
    res.sendStatus(500);
  }
});

// UPDATE
router.patch('/puzzles/:id', async (req, res) => {
  const ALLOWED = ["name", "level", "columnCount", "rowCount", "cells"];
  const patches = _.omit(req.body, ["createdAt", "_id", "__v"]);
  const updates = Object.keys(patches);
  const isValid = updates.every(a => ALLOWED.includes(a));

  if (!isValid) {
    const invalid = updates.filter(e => !ALLOWED.includes(e));
    console.log('Invalid attributes', JSON.stringify(invalid, null, 4));
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const puzzle = await Puzzle.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true, useFindAndModify: false });
    // console.log('puzzle', puzzle);

    if (!puzzle) {
      return res.sendStatus(404);
    }

    res.status(201).send(puzzle);
  } catch (error) {
    console.log('error', error);
    res.sendStatus(500);
  }
});

router.delete('/puzzles/:id', async (req, res) => {
  try {
    const result = await Puzzle.findOneAndDelete({ _id: req.params.id });
    if (result) {
      res.status(201).send(result);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
