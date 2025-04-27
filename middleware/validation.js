const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const incidentValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters long'),
    body('severity')
      .trim()
      .notEmpty()
      .withMessage('Severity is required')
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Severity must be Low, Medium, or High'),
    validate
  ],
  id: [
    param('id')
      .isMongoId()
      .withMessage('Invalid incident ID'),
    validate
  ],
  query: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('severity')
      .optional()
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Invalid severity value'),
    query('sort')
      .optional()
      .isIn(['reported_at', '-reported_at', 'severity', '-severity'])
      .withMessage('Invalid sort field'),
    validate
  ]
};

const userValidation = {
  register: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate
  ],
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required'),
    validate
  ]
};

module.exports = {
  incidentValidation,
  userValidation
}; 