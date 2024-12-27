import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import bookRoutes from './routes/bookRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is working!')
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err))

// Use book routes
app.use('/api/books', bookRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
