import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBooks } from '../api/getBooks.ts'
import { Book } from '../types/Book.ts'
import { updateBook } from '../api/updateBook.ts'
import styles from './styles.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedYear } from '../redux/selectedYear/selectors.ts'
import { selectIsModalOpen } from '../redux/modal/selectors.ts'
import { openModal, closeModal } from '../redux/modal/modalSlice.ts'
import { BookStats } from './BookStats'
import { AddBookModal } from './AddBookModal'

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

export const BookList = () => {
  const dispatch = useDispatch()
  const isModalOpen = useSelector(selectIsModalOpen)
  const selectedYear = useSelector(selectSelectedYear)

  const {
    data: books,
    isLoading,
    isError,
    error
  } = useQuery<Book[], Error>({
    queryKey: ['books', selectedYear],
    queryFn: () => fetchBooks(selectedYear)
  })

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

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading books: {error?.message}</div>

  return (
    <>
      {books && Boolean(books.length) ? (
        <>
          <BookStats books={books} />
          <hr />
          <button onClick={() => dispatch(openModal())}>Add New Book</button>
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
                    <input
                      type='number'
                      value={book.rating || ''}
                      onChange={(e) => {
                        const updatedBook = { ...book, rating: parseFloat(e.target.value) }
                        mutation.mutate(updatedBook) // Update rating
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
        </>
      ) : (
        <div>
          <p>No books found. Add your first book!</p>
          <button onClick={() => dispatch(openModal())}>Add Book</button>
        </div>
      )}

      <AddBookModal isOpen={isModalOpen} onClose={() => dispatch(closeModal())} />
    </>
  )
}
