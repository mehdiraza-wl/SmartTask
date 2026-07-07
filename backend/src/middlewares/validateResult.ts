import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

// validating the data passed using express-validator and returning in case of errors
export default function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
}