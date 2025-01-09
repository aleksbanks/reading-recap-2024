import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBooks } from '../api/getBooks.ts'
import { Book } from '../types/Book.ts'
import { updateBook } from '../api/updateBook.ts'
import styles from './styles.module.css'
import { useMemo } from 'react'

export const BookList = () => {
  const {
    data: books,
    isLoading,
    isError,
    error
  } = useQuery<Book[], Error>({
    queryKey: ['books'],
    queryFn: fetchBooks
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    }
  })

  const stats = useMemo(() => {
    if (!books) return null
    const totalBooks = books.length

    const englishBooks = books.filter((book) => book.language.toLowerCase() === 'english').length
    const russianBooks = books.filter((book) => book.language.toLowerCase() === 'russian').length
    const ebookBooks = books.filter((book) => book.format === 'ebook').length
    const audioBooks = books.filter((book) => book.format === 'audio').length
    const physicalBooks = books.filter((book) => book.format === 'physical book').length
    const queerBooks = books.filter((book) => book.isQueer).length
    const smutBooks = books.filter((book) => book.isSmut).length
    const bookClubChoices = books.filter((book) => book.isBookClubChoice).length
    const firstTimeReads = books.filter((book) => book.isFirstTimeRead).length
    const rereads = books.length - firstTimeReads

    const totalPages = books.reduce((sum, book) => sum + book.pages, 0)
    const totalRating = books.reduce((sum, book) => sum + (book.rating || 0), 0)
    const longestBook = books.reduce((prev, curr) => (curr.pages > prev.pages ? curr : prev), books[0])
    const shortestBook = books.reduce((prev, curr) => (curr.pages < prev.pages ? curr : prev), books[0])
    const percentage = (count: number) => ((count / totalBooks) * 100).toFixed(2)

    return {
      totalBooks,
      englishBooks,
      russianBooks,
      englishPercentage: percentage(englishBooks),
      russianPercentage: percentage(russianBooks),
      ebookBooks,
      audioBooks,
      physicalBooks,
      ebookPercentage: percentage(ebookBooks),
      audioPercentage: percentage(audioBooks),
      physicalPercentage: percentage(physicalBooks),
      queerBooks,
      smutBooks,
      bookClubChoices,
      firstTimeReads,
      rereads,
      queerPercentage: percentage(queerBooks),
      smutPercentage: percentage(smutBooks),
      bookClubPercentage: percentage(bookClubChoices),
      firstTimePercentage: percentage(firstTimeReads),
      rereadPercentage: percentage(rereads),
      averagePages: totalPages / totalBooks || 0,
      averageRating: totalRating / totalBooks || 0,
      longestBook,
      shortestBook
    }
  }, [books])

  const handleCheckboxChange = (bookId: string, field: string, value: boolean) => {
    // Find the updated book
    const updatedBook = books?.find((book) => book._id === bookId)
    if (updatedBook) {
      // Update the book and trigger the mutation
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
      {stats && (
        <section>
          <h2>Book Statistics</h2>
          <p>Total Books: {stats.totalBooks}</p>
          <p>
            English Books: {stats.englishBooks} ({stats.englishPercentage}%)
          </p>
          <p>
            Russian Books: {stats.russianBooks} ({stats.russianPercentage}%)
          </p>
          <p>
            eBooks: {stats.ebookBooks} ({stats.ebookPercentage}%)
          </p>
          <p>
            Audio Books: {stats.audioBooks} ({stats.audioPercentage}%)
          </p>
          <p>
            Physical Books: {stats.physicalBooks} ({stats.physicalPercentage}%)
          </p>
          <p>
            Queer Books: {stats.queerBooks} ({stats.queerPercentage}%)
          </p>
          <p>
            Smut Books: {stats.smutBooks} ({stats.smutPercentage}%)
          </p>
          <p>
            Book Club Choices: {stats.bookClubChoices} ({stats.bookClubPercentage}%)
          </p>
          <p>
            First-Time Reads: {stats.firstTimeReads} ({stats.firstTimePercentage}%)
          </p>
          <p>
            Rereads: {stats.rereads} ({stats.rereadPercentage}%)
          </p>
          <p>Average Pages: {stats.averagePages.toFixed(2)}</p>
          <p>Average Rating: {stats.averageRating.toFixed(2)}</p>
          <p>
            Longest Book: {stats.longestBook?.title} ({stats.longestBook?.pages} pages)
          </p>
          <p>
            Shortest Book: {stats.shortestBook?.title} ({stats.shortestBook?.pages} pages)
          </p>
        </section>
      )}
      <hr />
      <table className={styles.bookTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Pages</th>
            <th>Date Start</th>
            <th>Date End</th>
            <th>Genres</th>
            <th>Language</th>
            <th>Format</th>
            <th>isSmut</th>
            <th>isBookClubChoice</th>
            <th>isQueer</th>
            <th>isFirstTimeRead</th>
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
              <td>{new Date(book.dateStart).toLocaleDateString()}</td>
              <td>{new Date(book.dateEnd).toLocaleDateString()}</td>
              <td>{book.genres.join(', ')}</td>
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
                  checked={book.isSmut}
                  onChange={() => handleCheckboxChange(book._id, 'isSmut', !book.isSmut)}
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
  )
}
