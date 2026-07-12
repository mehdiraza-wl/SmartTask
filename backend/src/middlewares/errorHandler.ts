import type { Request, Response, NextFunction, RequestHandler, } from 'express';

export const errorHandler=(error: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(error.status || 500).json({
        success: false,
        message: error.message
    })
  }