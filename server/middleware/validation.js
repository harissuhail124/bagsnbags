const { z } = require('zod');

/**
 * Middleware that validates req.body (or req.query) against a Zod schema.
 * If validation fails, forwards an error with status 400.
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const data = source === 'query' ? req.query : req.body;
    schema.parse(data);
    next();
  } catch (e) {
    const err = new Error('Validation error');
    err.statusCode = 400;
    err.details = e.errors.map(err => err.message).join(', ');
    next(err);
  }
};

module.exports = { validate };
