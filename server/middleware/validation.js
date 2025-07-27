const { z } = require('zod');

// Generic validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedData = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors?.map(err => ({
            field: err.path?.join('.') || 'unknown',
            message: err.message || 'Validation error',
            code: err.code || 'unknown',
            received: err.received
          })) || [],
          rawErrors: error.errors // Include raw errors for debugging
        });
      }
      console.error('Non-Zod validation error:', error);
      next(error);
    }
  };
};

// Validate query parameters
const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Query validation failed',
          details: error.errors?.map(err => ({
            field: err.path?.join('.') || 'unknown',
            message: err.message || 'Validation error',
            code: err.code || 'unknown'
          })) || []
        });
      }
      next(error);
    }
  };
};

// Validate URL parameters
const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedParams = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Parameter validation failed',
          details: error.errors?.map(err => ({
            field: err.path?.join('.') || 'unknown',
            message: err.message || 'Validation error',
            code: err.code || 'unknown'
          })) || []
        });
      }
      next(error);
    }
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
};