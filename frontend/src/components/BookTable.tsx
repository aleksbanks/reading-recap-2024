import { updateBook } from '../api/updateBook'
import { Book } from '../types/Book'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import styles from './styles.module.css'
import { StarRating } from './StarRating'

type Props = {
  books: Book[]
}

const TABLE_HEADERS = [
  'Title',
  'Author',
  'Rating',
  'Pages',
  'Date Start',
  'Date End',
  'Language',
  'Format',
  'Has Smut Scenes',
  'Book Club Choice',
  'Queer',
  'First Time Read'
]

export const BookTable = ({ books }: Props) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    }
  })

  const handleCheckboxChange = (bookId: string, field: string, value: boolean) => {
    const updatedBook = books?.find((book) => book._id === bookId)
    if (updatedBook) {
      const updatedData = { ...updatedBook, [field]: value }
      mutation.mutate(updatedData) // Pass updated data to mutation
    }
  }

  const handleSelectChange = (bookId: string, field: string, value: string | boolean) => {
    const updatedBooks = books?.map((book) => {
      if (book._id === bookId) {
        return { ...book, [field]: value }
      }
      return book
    })

    const updatedBook = updatedBooks?.find((book) => book._id === bookId)
    if (updatedBook) {
      mutation.mutate(updatedBook)
    }
  }

  return (
    <table className={styles.bookTable}>
      <thead>
        <tr>
          {TABLE_HEADERS.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {books?.map((book: Book) => (
          <tr key={book._id}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>
              <StarRating
                rating={book.rating}
                onRatingChange={(value) => {
                  const updatedBook = { ...book, rating: value }
                  mutation.mutate(updatedBook)
                }}
              />
            </td>
            <td>{book.pages}</td>
            <td>{book.dateStart ? new Date(book.dateStart).toLocaleDateString() : ''}</td>
            <td>{book.dateEnd ? new Date(book.dateEnd).toLocaleDateString() : ''}</td>
            <td>
              <select
                value={book.language || 'English'}
                onChange={(e) => handleSelectChange(book._id, 'language', e.target.value)}>
                <option value='English'>English</option>
                <option value='Russian'>Russian</option>
              </select>
            </td>
            <td>
              <select
                value={book.format || 'ebook'}
                onChange={(e) => handleSelectChange(book._id, 'format', e.target.value)}>
                <option value='ebook'>eBook</option>
                <option value='audio'>Audio</option>
                <option value='physical book'>Physical Book</option>
              </select>
            </td>
            <td>
              <input
                type='checkbox'
                checked={book.haveAtLeastOneSmutScene}
                onChange={() =>
                  handleCheckboxChange(book._id, 'haveAtLeastOneSmutScene', !book.haveAtLeastOneSmutScene)
                }
              />
            </td>
            <td>
              <input
                type='checkbox'
                checked={book.isBookClubChoice || false}
                onChange={() => handleCheckboxChange(book._id, 'isBookClubChoice', !book.isBookClubChoice)}
              />
            </td>
            <td>
              <input
                type='checkbox'
                checked={book.isQueer || false}
                onChange={() => handleCheckboxChange(book._id, 'isQueer', !book.isQueer)}
              />
            </td>
            <td>
              <input
                type='checkbox'
                checked={book.isFirstTimeRead || false}
                onChange={() => handleCheckboxChange(book._id, 'isFirstTimeRead', !book.isFirstTimeRead)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
