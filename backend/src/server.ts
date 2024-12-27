import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import bookRoutes from './routes/bookRoutes'
import errorHandler from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5002

// Middleware
app.use(cors())
app.use(errorHandler)
app.use(express.json())
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is working!')
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: Error) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Use book routes
app.use('/api/books', bookRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
