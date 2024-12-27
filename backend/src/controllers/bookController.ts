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
