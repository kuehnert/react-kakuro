const express = require('express');
const router = new express.Router();
// const auth = require('../middleware/auth');
const _ = require('lodash');
const Puzzle = require('../models/puzzle');
const debug = require('../utils/debug');
const auth = require('../middleware/auth');
const import_menneske = require('../utils/import_menneske');

// FETCH ALL
router.get('/puzzles', async (req, res) => {
  try {
    const puzzles = await Puzzle.find(
      {},
      'name level columnCount rowCount creatorName cellString createdAt'
    ).sort('createdAt');
    res.send(puzzles);
  } catch (error) {
    res.sendStatus(500);
  }
});

// CREATE
router.post('/puzzles', auth, async (req, res) => {
  const values = _.omit(req.body, ['state', 'hintCount']);
  const ALLOWED = ['name', 'level', 'columnCount', 'rowCount', 'cellString'];
  const keys = Object.keys(values);
  const isValid = keys.every(a => ALLOWED.includes(a));

  if (!isValid) {
    console.log('invalid', values);
    return res.status(400).send({
      error: `Invalid values. Allowed values are: ${ALLOWED.join(', ')}`,
    });
  }

  try {
    const puzzle = new Puzzle({
      ...values,
      creatorID: req.user._id,
      creatorName: req.user.name,
      createdAt: new Date(),
    });

    await puzzle.save();
    res.status(202).send(puzzle);
  } catch (error) {
    console.log('error', error);

    if (error.code === 11000) {
      res
        .status(500)
        .send({ code: 11000, message: 'Puzzle already in database' });
    } else {
      res.status(500).send({ error });
    }
  }
});

router.post('/puzzles/steal', async (req, res) => {
  try {
    const size = req.body.size;
    console.log('size', size);
    const values = await import_menneske(size);
    console.log('values', values);
    if (values.error) {
      console.error(values.error);
      return res.status(500).send(values);
    }

    const puzzle = new Puzzle({
      ...values,
      creatorID: 'mrrobot',
      creatorName: 'Menneske',
      createdAt: new Date(),
    });
    await puzzle.save();
    res.status(202).send(puzzle);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

// UPDATE
// router.patch('/puzzles/:id', auth, async (req, res) => {
//   const ALLOWED = ['name', 'level', 'columnCount', 'rowCount', 'cells'];
//   const patches = _.omit(req.body, ['createdAt', '_id', '__v']);
//   const updates = Object.keys(patches);
//   const isValid = updates.every(a => ALLOWED.includes(a));

//   if (!isValid) {
//     const invalid = updates.filter(e => !ALLOWED.includes(e));
//     console.log('Invalid attributes', JSON.stringify(invalid, null, 4));
//     return res.status(400).send({ error: 'Invalid updates' });
//   }

//   try {
//     const puzzle = await Puzzle.findOneAndUpdate(
//       { _id: req.params.id },
//       req.body,
//       { new: true, runValidators: true, useFindAndModify: false }
//     );
//     // console.log('puzzle', puzzle);

//     if (!puzzle) {
//       return res.sendStatus(404);
//     }

//     res.status(201).send(puzzle);
//   } catch (error) {
//     console.log('error', error);
//     res.sendStatus(500);
//   }
// });

// router.delete('/puzzles/:id', async (req, res) => {
//   try {
//     const result = await Puzzle.findOneAndDelete({ _id: req.params.id });
//     if (result) {
//       res.status(201).send(result);
//     } else {
//       res.sendStatus(404);
//     }
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

module.exports = router;
