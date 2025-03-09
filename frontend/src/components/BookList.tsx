import { useQuery } from '@tanstack/react-query'
import { fetchBooks } from '../api/getBooks.ts'
import { Book } from '../types/Book.ts'
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedYear } from '../redux/selectedYear/selectors.ts'
import { selectIsModalOpen } from '../redux/modal/selectors.ts'
import { openModal, closeModal } from '../redux/modal/modalSlice.ts'
import { BookStats } from './BookStats'
import { AddBookModal } from './AddBookModal'
import { BookTable } from './BookTable.tsx'

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

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading books: {error?.message}</div>

  return (
    <>
      {books && Boolean(books.length) ? (
        <>
          <BookStats books={books} />
          <hr />
          <button onClick={() => dispatch(openModal())}>Add New Book</button>
          <BookTable books={books} />
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
