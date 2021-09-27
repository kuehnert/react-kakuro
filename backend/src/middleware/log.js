
const log = async (req, res, next) => {
  console.log(req.method, req.path);
  next();
};

module.exports = log;
