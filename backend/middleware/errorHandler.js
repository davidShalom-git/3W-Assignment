// Express recognizes error middleware by its 4-arg signature - keep all 4 params
// even though `next` is unused, or Express treats this as a normal route handler.
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} already in use` });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: 'Something went wrong on our end' });
}

module.exports = errorHandler;
