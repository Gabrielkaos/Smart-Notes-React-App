const {body, param, validationResult} = require("express-validator")

const validate = (req, res, next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            error:"validation error",
            details:errors.array()
        })
    }
    next()
}

const validateRegister = [
    body("username")
        .trim()
        .isLength({min:3,max:30})
        .withMessage("Username must be more than 3 or less than 30")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),

    body("password")
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    validate
]


const validateLogin = [
  body('username')
    .trim()
    .isLength({min:3,max:30})
    .withMessage("Username must be more than 3 or less than 30")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

const validateNote = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  validate
];

const validateNoteId = [
  param('id')
    .isUUID()
    .withMessage('Invalid note ID'),
  
  validate
];

module.exports = {
  validateRegister,
  validateLogin,
  validateNote,
  validateNoteId
};