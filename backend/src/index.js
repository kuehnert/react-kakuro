const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const puzzleRouter = require('./routers/puzzle');
const userRouter = require('./routers/user');
const log = require('./middleware/log');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(log);
app.use(puzzleRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log('Server runnnig on port', port);
});
