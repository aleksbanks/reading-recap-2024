import { Request, Response, NextFunction } from 'express'

// Error handling middleware
const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void = (err, req, res) => {
  console.error(err.stack) // Log the error details

  // Customize error messages based on the type of error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  res.status(500).json({ error: err.message })
}

export default errorHandler
