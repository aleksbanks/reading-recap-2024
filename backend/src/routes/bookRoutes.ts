import express from 'express'
import { createBook, getBooks, getBookById, updateBook, deleteBook, getBooksByYear, getUniqueAuthors } from '../controllers/bookController'

const router = express.Router()

// Create a new book
router.post('/', createBook)

// Get all books
router.get('/', getBooks)

// Get books by year
router.get('/year', getBooksByYear)

// Get unique authors
router.get('/authors', getUniqueAuthors)

// Get a specific book by ID
router.get('/:id', getBookById)

// Update a book by ID
router.put('/:id', updateBook)

// Delete a book by ID
router.delete('/:id', deleteBook)

export default router
