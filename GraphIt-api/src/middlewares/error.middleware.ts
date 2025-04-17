import type { Request, Response, NextFunction } from "express";
import { makeError } from "../utils/errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorResponse = makeError(err);

  res.status(errorResponse.statusCode).json({
    success: false,
    error: {
      name: errorResponse.error.name,
      message: errorResponse.error.message,
    },
  });
};
