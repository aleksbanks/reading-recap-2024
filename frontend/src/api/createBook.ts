import { API_URL } from '../const/url'
import { Book } from '../types/Book'
import axios from 'axios'

export const createBook = async (book: Partial<Book>) => {
  const response = await axios.post(`${API_URL}/books`, book)
  return response.data
}
