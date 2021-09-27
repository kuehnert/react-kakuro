function debug(message) {
  if (process.env.DEBUG === "true") {
    console.log('DEBUG', message);
  }
}

module.exports = debug;
