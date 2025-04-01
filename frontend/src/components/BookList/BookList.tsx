import { useQuery } from '@tanstack/react-query'
import { fetchBooks } from '../../api/getBooks.ts'
import { Book } from '../../types/Book.ts'
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedYear } from '../../redux/selectedYear/selectors.ts'
import { selectIsModalOpen } from '../../redux/modal/selectors.ts'
import { openModal, closeModal } from '../../redux/modal/modalSlice.ts'
import { BookStats } from '../BookStats/BookStats.tsx'
import { AddBookModal } from '../AddBookModal/AddBookModal.tsx'
import { BookTable } from '../BookTable/BookTable.tsx'
import { TABLE_HEADERS } from '../BookTable/constants.ts'
import { getBoolValue } from '../../utils/getBoolValue.ts'
import { useCallback } from 'react'
import styles from './BookList.module.css'

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

  const exportToCSV = useCallback(
    (books: Book[]) => {
      const csvContent =
        TABLE_HEADERS.join(',') +
        '\n' +
        books
          .map(
            (book) =>
              `"${book.title}",${book.author},${book.rating},${book.pages},${book.dateStart ? new Date(book.dateStart).toLocaleDateString() : ''},${book.dateEnd ? new Date(book.dateEnd).toLocaleDateString() : ''},${book.language},${book.format},${getBoolValue(book.haveAtLeastOneSmutScene)},${getBoolValue(book.isBookClubChoice)},${getBoolValue(book.isQueer)},${getBoolValue(book.isFirstTimeRead)}`
          )
          .join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })

      console.log(csvContent, blob)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `books_${selectedYear}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
    [selectedYear]
  )

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading books: {error?.message}</div>

  return (
    <>
      {books && Boolean(books.length) ? (
        <>
          <BookStats books={books} />
          <hr />
          <div className={styles.buttonGroup}>
            <button onClick={() => dispatch(openModal())}>Add New Book</button>
            <button onClick={() => exportToCSV(books)}>Export to CSV</button>
          </div>
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
