import mongoose from 'mongoose'
import csv from 'csv-parser'
import fs from 'fs'
import dotenv from 'dotenv'
import Book from '../models/Book'
import path from 'path'

dotenv.config()
const filePath = path.join(__dirname, './goodreads_library_export.csv')
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err)
    process.exit(1) // Exit if MongoDB connection fails
  })

// Function to parse dates with error handling
const parseDate = (dateString: string): Date | null => {
  const date = new Date(dateString)
  return !isNaN(date.valueOf()) ? date : null
}

// Function to filter books that have either dateStart or dateEnd in the current year
const filterCurrentYearBooks = (dateStart: Date | null, dateEnd: Date | null): boolean => {
  const currentYear = new Date().getFullYear()

  // Check if dateStart or dateEnd is within the current year
  const isDateStartInCurrentYear = dateStart && dateStart.getFullYear() === currentYear
  const isDateEndInCurrentYear = dateEnd && dateEnd.getFullYear() === currentYear

  return Boolean(isDateStartInCurrentYear || isDateEndInCurrentYear)
}

// Function to check if the book already exists in the database
const checkIfExists = async (title: string, author: string) => {
  const existingBook = await Book.findOne({ title, author })
  return existingBook !== null
}

// Function to read CSV and import data
const importCSV = () => {
  const results: any[] = []

  // Read the CSV file and parse the data
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Filter rows where "Exclusive Shelf" is "read"
      if (data['Exclusive Shelf'] === 'read') {
        const transformedData = {
          title: data['Title'], // "Title" in CSV to "title" in model
          author: data['Author'], // "Author" in CSV to "author" in model
          rating: data['My Rating'] || 0, // "My rating" to "rating" (parse as float)
          pages: parseInt(data['Number of Pages'], 10) || 0, // "Number of Pages" to "pages" (parse as int)
          dateStart: parseDate(data['Date Added']), // "Date Added" to "dateStart"
          dateEnd: data['Date Read'] ? new Date(data['Date Read']) : null // "Date Read" to "dateEnd"
        }
        // Only add books that have either dateStart or dateEnd in the current year
        if (filterCurrentYearBooks(transformedData.dateStart, transformedData.dateEnd)) {
          results.push(transformedData)
        }
      }
    })
    .on('end', async () => {
      try {
        for (const book of results) {
          const exists = await checkIfExists(book.title, book.author)
          if (!exists) {
            await Book.create(book) // Insert the book if it doesn't exist
            console.log(`Book added: ${book.title} by ${book.author}`)
          } else {
            console.log(`Book already exists: ${book.title} by ${book.author}`)
          }
        }
        console.log('Data successfully imported', results.length)
        mongoose.disconnect() // Disconnect after the operation is done
        console.log('Disconnected from MongoDB')
      } catch (err) {
        console.error('Error importing data:', err)
        mongoose.disconnect()
      }
    })
}

importCSV()
