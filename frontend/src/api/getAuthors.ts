import axios from 'axios'
import { API_URL } from '../const/url'

export interface Author {
  name: string
  count: number
}

// Fetch authors from the backend
export const fetchAuthors = async (): Promise<Author[]> => {
  const response = await axios.get(`${API_URL}/books/authors`)
  return response.data
} 