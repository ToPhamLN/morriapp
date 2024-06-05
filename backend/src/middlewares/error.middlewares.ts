import { Request, Response, NextFunction } from 'express'

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // let statusCode: number =
  //   res.statusCode === 200 ? 500 : res.statusCode
  let statusCode: number = (err as any).statusCode || 500
  let message: string = err.message

  if (
    err.name === 'CastError' &&
    (err as any).kind === 'ObjectId'
  ) {
    statusCode = 404
    message = 'Resource not found'
  }

  res.status(statusCode).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : message,
    stack:
      process.env.NODE_ENV === 'production' ? null : err.stack
  })
}
