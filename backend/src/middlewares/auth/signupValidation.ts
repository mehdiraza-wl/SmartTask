import { body, validationResult } from 'express-validator';

export const signupValidation = [
  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),
];