import { body } from "express-validator";

export const createProjectValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Project description is required."),

    body('owner_id')
    .notEmpty()
    .withMessage("Owner id is required"),

    body("category_id")
        .notEmpty()
        .withMessage("Project category is required."),

    body("status")
        .optional()
        .isIn(["planned", "active", "archived"])
        .withMessage("Invalid project status."),

    body("tags")
    .isArray()
    .withMessage("Tags must be an array."),
];