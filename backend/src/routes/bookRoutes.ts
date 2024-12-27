import express, { Request, Response } from 'express'
import Book from '../models/Book'

const router = express.Router()

// Get all books
router.get('/', async (req: Request, res: Response) => {
  try {
    const books = await Book.find()
    res.json(books)
  } catch (err: any) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message })
    } else {
      res.status(400).json({ message: 'An unknown error occurred' })
    }
  }
})

// Create a new book
router.post('/', async (req: Request, res: Response) => {
  const {
    title,
    author,
    pages,
    genres,
    language,
    format,
    dateStart,
    dateEnd,
    isSmut,
    rating,
    isBookClubChoice,
    isQueer,
    isFirstTimeRead
  } = req.body

  const book = new Book({
    title,
    author,
    pages,
    genres,
    language,
    format,
    dateStart,
    dateEnd,
    isSmut,
    isBookClubChoice,
    isQueer,
    rating: rating || null,
    isFirstTimeRead: isFirstTimeRead || true
  })

  try {
    const newBook = await book.save()
    res.status(201).json(newBook)
  } catch (err: any) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message })
    } else {
      res.status(400).json({ message: 'An unknown error occurred' })
    }
  }
})

export default router
