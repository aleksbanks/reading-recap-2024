import { useState } from 'react'
import { Book } from '../types/Book'

interface BookStatsProps {
  books: Book[]
}

export const BookStats = ({ books }: BookStatsProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const stats = {
    totalBooks: books.length,
    englishBooks: books.filter((book) => book.language.toLowerCase() === 'english').length,
    russianBooks: books.filter((book) => book.language.toLowerCase() === 'russian').length,
    ebookBooks: books.filter((book) => book.format === 'ebook').length,
    audioBooks: books.filter((book) => book.format === 'audio').length,
    physicalBooks: books.filter((book) => book.format === 'physical book').length,
    queerBooks: books.filter((book) => book.isQueer).length,
    smutBooks: books.filter((book) => book.haveAtLeastOneSmutScene).length,
    bookClubChoices: books.filter((book) => book.isBookClubChoice).length,
    firstTimeReads: books.filter((book) => book.isFirstTimeRead).length,
    rereads: books.length - books.filter((book) => book.isFirstTimeRead).length,
    totalPages: books.reduce((sum, book) => sum + book.pages, 0),
    totalRating: books.reduce((sum, book) => sum + (book.rating || 0), 0),
    longestBook: books.reduce((prev, curr) => (curr.pages > prev.pages ? curr : prev), books[0]),
    shortestBook: books.reduce((prev, curr) => (curr.pages < prev.pages ? curr : prev), books[0])
  }

  const percentage = (count: number) => ((count / (stats.totalBooks || 1)) * 100).toFixed(2)

  return (
    <section className='stats-section'>
      <h2 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        📊 Book Statistics {isExpanded ? '▼' : '▶'}
      </h2>

      {isExpanded && (
        <div className='stats-content'>
          <p>Total Books: {stats.totalBooks}</p>
          <p>
            English Books: {stats.englishBooks} ({percentage(stats.englishBooks)}%)
          </p>
          <p>
            Russian Books: {stats.russianBooks} ({percentage(stats.russianBooks)}%)
          </p>
          <p>
            eBooks: {stats.ebookBooks} ({percentage(stats.ebookBooks)}%)
          </p>
          <p>
            Audio Books: {stats.audioBooks} ({percentage(stats.audioBooks)}%)
          </p>
          <p>
            Physical Books: {stats.physicalBooks} ({percentage(stats.physicalBooks)}%)
          </p>
          <p>
            Queer Books: {stats.queerBooks} ({percentage(stats.queerBooks)}%)
          </p>
          <p>
            Books with Smut Scenes: {stats.smutBooks} ({percentage(stats.smutBooks)}%)
          </p>
          <p>
            Book Club Choices: {stats.bookClubChoices} ({percentage(stats.bookClubChoices)}%)
          </p>
          <p>
            First-Time Reads: {stats.firstTimeReads} ({percentage(stats.firstTimeReads)}%)
          </p>
          <p>
            Rereads: {stats.rereads} ({percentage(stats.rereads)}%)
          </p>
          <p>Average Pages: {(stats.totalPages / stats.totalBooks).toFixed(2)}</p>
          <p>Average Rating: {(stats.totalRating / stats.totalBooks).toFixed(2)}</p>
          <p>
            Longest Book: {stats.longestBook?.title} ({stats.longestBook?.pages} pages)
          </p>
          <p>
            Shortest Book: {stats.shortestBook?.title} ({stats.shortestBook?.pages} pages)
          </p>
        </div>
      )}
    </section>
  )
}
