import axios from 'axios'
import { API_URL } from '../const/url.ts'
import type { Book } from '../types/Book.ts'

export const updateBook = async (updatedBook: Book): Promise<Book> => {
  const response = await axios.put(`${API_URL}/books/${updatedBook._id}`, updatedBook)
  return response.data
}
