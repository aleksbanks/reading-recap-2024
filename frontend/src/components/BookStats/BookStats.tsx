import { useState } from 'react'
import { Book } from '../../types/Book'
import styles from './BookStats.module.css'

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

  const percentage = (count: number) => ((count / (stats.totalBooks || 1)) * 100).toFixed()

  return (
    <section className={styles.statsSection}>
      <h2 onClick={() => setIsExpanded(!isExpanded)} className={styles.statsHeader}>
        📊 Book Statistics {isExpanded ? '▼' : '▶'}
      </h2>

      {isExpanded && (
        <div className={styles.statsContent}>
          <div className={styles.statsOverview}>
            <div className={styles.statCard}>
              <h3>📚 Total Books</h3>
              <div className={styles.statValue}>{stats.totalBooks}</div>
            </div>
            <div className={styles.statCard}>
              <h3>📄 Total Pages</h3>
              <div className={styles.statValue}>{stats.totalPages}</div>
            </div>
          </div>
          <div className={styles.statsOverview}>
            <div className={styles.statCard}>
              <h3>⭐ Average Rating</h3>
              <div className={styles.statValue}>{(stats.totalRating / (stats.totalBooks || 1)).toFixed(1)}</div>
            </div>
            <div className={styles.statCard}>
              <h3>📖 Average Pages</h3>
              <div className={styles.statValue}>{Math.round(stats.totalPages / (stats.totalBooks || 1))}</div>
            </div>
            <div className={styles.statCard}>
              <h3>📅 Average Days to Finish a Book</h3>
              <div className={styles.statValue}>
                {Math.round(
                  books.reduce((sum, book) => {
                    if (book.dateStart && book.dateEnd) {
                      const start = new Date(book.dateStart)
                      const end = new Date(book.dateEnd)
                      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                    }
                    return sum
                  }, 0) / (books.filter((book) => book.dateStart && book.dateEnd).length || 1)
                )}
              </div>
            </div>
          </div>

          <div className={styles.statGroups}>
            <div className={styles.statGroup}>
              <h3>Languages</h3>
              <div className={styles.statRow}>
                <span>🇬🇧 English</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${percentage(stats.englishBooks)}%` }}></div>
                </div>
                <span>
                  {stats.englishBooks} ({percentage(stats.englishBooks)}%)
                </span>
              </div>
              <div className={styles.statRow}>
                <span>🇷🇺 Russian</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${percentage(stats.russianBooks)}%` }}></div>
                </div>
                <span>
                  {stats.russianBooks} ({percentage(stats.russianBooks)}%)
                </span>
              </div>
            </div>

            <div className={styles.statGroup}>
              <h3>Formats</h3>
              <div className={styles.statRow}>
                <span>📱 eBook</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${percentage(stats.ebookBooks)}%` }}></div>
                </div>
                <span>
                  {stats.ebookBooks} ({percentage(stats.ebookBooks)}%)
                </span>
              </div>
              <div className={styles.statRow}>
                <span>🎧 Audio</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${percentage(stats.audioBooks)}%` }}></div>
                </div>
                <span>
                  {stats.audioBooks} ({percentage(stats.audioBooks)}%)
                </span>
              </div>
              <div className={styles.statRow}>
                <span>📖 Physical</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${percentage(stats.physicalBooks)}%` }}></div>
                </div>
                <span>
                  {stats.physicalBooks} ({percentage(stats.physicalBooks)}%)
                </span>
              </div>
            </div>

            <div className={styles.statGroup}>
              <h3>Categories</h3>
              <div className={styles.statRow}>
                <span>🏳️‍🌈 Queer</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${percentage(stats.queerBooks)}%` }}></div>
                </div>
                <span>
                  {stats.queerBooks} ({percentage(stats.queerBooks)}%)
                </span>
              </div>
              <div className={styles.statRow}>
                <span>💋 Smut Scenes</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${percentage(stats.smutBooks)}%` }}></div>
                </div>
                <span>
                  {stats.smutBooks} ({percentage(stats.smutBooks)}%)
                </span>
              </div>
              <div className={styles.statRow}>
                <span>👥 Book Club</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${percentage(stats.bookClubChoices)}%` }}></div>
                </div>
                <span>
                  {stats.bookClubChoices} ({percentage(stats.bookClubChoices)}%)
                </span>
              </div>
            </div>

            <div className={styles.statGroup}>
              <h3>Reading History</h3>
              <div className={styles.statRow}>
                <span>🆕 First Time</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${percentage(stats.firstTimeReads)}%` }}></div>
                </div>
                <span>
                  {stats.firstTimeReads} ({percentage(stats.firstTimeReads)}%)
                </span>
              </div>
              <div className={styles.statRow}>
                <span>🔄 Rereads</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${percentage(stats.rereads)}%` }}></div>
                </div>
                <span>
                  {stats.rereads} ({percentage(stats.rereads)}%)
                </span>
              </div>
            </div>
          </div>

          <div className={styles.bookHighlights}>
            <div className={styles.statCard}>
              <h3>📏 Longest Book:</h3>
              <div className={styles.bookInfo}>
                <div className={styles.bookTitle}>
                  {stats.longestBook?.title ? stats.longestBook?.title : 'No longest book found'}
                  {stats.longestBook?.author ? ` (${stats.longestBook?.author})` : ''}
                </div>
                <div className={styles.bookPages}>{stats.longestBook?.pages} pages</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <h3>🔍 Shortest Book:</h3>
              <div className={styles.bookInfo}>
                <div className={styles.bookTitle}>
                  {stats.shortestBook?.title ? stats.shortestBook?.title : 'No shortest book find'}
                  {stats.shortestBook?.author ? ` (${stats.shortestBook?.author})` : ''}
                </div>
                <div className={styles.bookPages}>{stats.shortestBook?.pages} pages</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
