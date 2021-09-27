const mongoose = require("mongoose");

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_DB} = process.env

const connectionURL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}`;

mongoose.connect(connectionURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
