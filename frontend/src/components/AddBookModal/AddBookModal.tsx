import { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Book } from '../../types/Book'
import styles from './styles.module.css'
import { selectSelectedYear } from '../../redux/selectedYear/selectors'
import { useSelector } from 'react-redux'
import { StarRating } from '../StarRating/StarRating'
import { createBook } from '../../api/createBook'
import { fetchAuthors, Author } from '../../api/getAuthors'

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const initialBook: Partial<Book> = {
  title: '',
  author: '',
  pages: 0,
  genres: [],
  language: 'English',
  format: 'ebook',
  dateStart: new Date().toISOString().slice(0, 10),
  dateEnd: new Date().toISOString().slice(0, 10),
  haveAtLeastOneSmutScene: false,
  rating: undefined,
  isBookClubChoice: false,
  isQueer: false,
  isFirstTimeRead: true,
  month: new Date().getMonth() + 1
}

export const AddBookModal = ({ isOpen, onClose }: AddBookModalProps) => {
  const selectedYear = useSelector(selectSelectedYear)
  const [newBook, setNewBook] = useState<Partial<Book>>({
    ...initialBook,
    year: selectedYear
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: fetchAuthors
  })

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(newBook.author?.toLowerCase() || '')
  )

  const handleClose = () => {
    setNewBook({ ...initialBook, year: selectedYear })
    onClose()
  }

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      handleClose()
    }
  })

  const handleAuthorFromListClick = (author: Author) => {
    setNewBook({ ...newBook, author: author.name })
    setShowSuggestions(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2>Add New Book</h2>
          <form
            id='addBookForm'
            onSubmit={(e) => {
              e.preventDefault()
              const bookWithDates = {
                ...newBook,
                dateStart: newBook.dateStart ? new Date(newBook.dateStart) : null,
                dateEnd: newBook.dateEnd ? new Date(newBook.dateEnd) : null
              }
              mutation.mutate(bookWithDates)
            }}>
            <div className={styles.formGroup}>
              <label>Rating:</label>
              <StarRating rating={newBook.rating} onRatingChange={(rating) => setNewBook({ ...newBook, rating })} />
            </div>

            <div className={styles.formGroup}>
              <label>Title:</label>
              <input
                type='text'
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Author:</label>
              <div className={styles.autocompleteContainer} ref={suggestionsRef}>
                <input
                  type='text'
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  onFocus={() => setShowSuggestions(true)}
                  required
                />
                {showSuggestions && filteredAuthors.length > 0 && (
                  <ul className={styles.suggestionsList}>
                    {filteredAuthors.map((author) => (
                      <li key={author.name} onClick={() => handleAuthorFromListClick(author)}>
                        <span>{author.name}</span>
                        <span className={styles.authorCount}>{author.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Pages:</label>
              <input
                type='number'
                value={newBook.pages}
                onChange={(e) => setNewBook({ ...newBook, pages: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Language:</label>
              <select value={newBook.language} onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}>
                <option value='English'>English</option>
                <option value='Russian'>Russian</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Format:</label>
              <select
                value={newBook.format}
                onChange={(e) => setNewBook({ ...newBook, format: e.target.value as Book['format'] })}>
                <option value='ebook'>eBook</option>
                <option value='audio'>Audio</option>
                <option value='physical book'>Physical Book</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Date Started:</label>
              <input
                type='date'
                value={newBook.dateStart?.toString() || ''}
                onChange={(e) => setNewBook({ ...newBook, dateStart: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Date Finished:</label>
              <input
                type='date'
                value={newBook.dateEnd?.toString() || ''}
                onChange={(e) => setNewBook({ ...newBook, dateEnd: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Month Read:</label>
              <select
                value={newBook.month}
                onChange={(e) => setNewBook({ ...newBook, month: parseInt(e.target.value) })}
                required>
                {MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.checkboxs}>
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type='checkbox'
                    checked={newBook.haveAtLeastOneSmutScene}
                    onChange={(e) => setNewBook({ ...newBook, haveAtLeastOneSmutScene: e.target.checked })}
                  />
                  Has Smut Scenes
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type='checkbox'
                    checked={newBook.isBookClubChoice}
                    onChange={(e) => setNewBook({ ...newBook, isBookClubChoice: e.target.checked })}
                  />
                  Book Club Choice
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type='checkbox'
                    checked={newBook.isQueer}
                    onChange={(e) => setNewBook({ ...newBook, isQueer: e.target.checked })}
                  />
                  Queer
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type='checkbox'
                    checked={newBook.isFirstTimeRead}
                    onChange={(e) => setNewBook({ ...newBook, isFirstTimeRead: e.target.checked })}
                  />
                  First Time Read
                </label>
              </div>
            </div>
          </form>
        </div>

        <div className={styles.modalActions}>
          <button type='submit' form='addBookForm'>
            Add Book
          </button>
          <button type='button' onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
