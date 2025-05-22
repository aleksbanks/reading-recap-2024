import { Request, Response } from 'express'
import Book, { IBook } from '../models/Book'

// Create a new book
export const createBook = async (req: Request, res: Response) => {
  try {
    const newBook = new Book(req.body)
    const savedBook = await newBook.save()
    res.status(201).json(savedBook)
  } catch (err) {
    res.status(400).json({ error: (err as Error).message })
  }
}

// Get all books
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books: IBook[] = await Book.find()
    res.json(books)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

// Get books by year
export const getBooksByYear = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string)
    const books: IBook[] = await Book.find({ year: year })
    const sortedByCreatedAt = books.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    res.json(sortedByCreatedAt)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

// Get a specific book by ID
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      res.status(404).json({ error: 'Book not found' })
      return
    }
    res.json(book)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

// Update a book by ID
export const updateBook = async (req: Request, res: Response) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedBook) {
      res.status(404).json({ error: 'Book not found' })
      return
    }
    res.json(updatedBook)
  } catch (err) {
    res.status(400).json({ error: (err as Error).message })
  }
}

// Delete a book by ID
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id)
    if (!deletedBook) {
      res.status(404).json({ error: 'Book not found' })
      return
    }
    res.json({ message: 'Book deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

// Get unique authors with book counts and sort by count
export const getUniqueAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Book.aggregate([
      {
        $group: {
          _id: '$author',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: 1
        }
      },
      {
        $sort: { count: -1, name: 1 }
      }
    ])
    res.json(authors)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}
