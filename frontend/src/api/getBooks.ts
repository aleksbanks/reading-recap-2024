import axios from 'axios'
import { Book } from '../types/Book.ts'
import { API_URL } from '../const/url.ts'

export const fetchBooks = async (year: number): Promise<Book[]> => {
  const response = await axios.get(`${API_URL}/books/year?year=${year}`)
  return response.data
}
