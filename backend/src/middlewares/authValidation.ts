import { body } from 'express-validator';

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

export const verifyEmail = [
  body("email")
    .isEmail()
    .withMessage("Invalid email")
]

export const passwordValidation = [body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
]


export const verifyLoginCredentials = [...verifyEmail, ...passwordValidation]