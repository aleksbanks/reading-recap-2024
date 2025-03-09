import { useState } from 'react'
import styles from './StarRating.module.css'

interface StarRatingProps {
  rating: number | undefined
  onRatingChange: (rating: number) => void
}

export const StarRating = ({ rating = 0, onRatingChange }: StarRatingProps) => {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${(hover || rating) >= star ? styles.filled : ''}`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}>
          ★
        </span>
      ))}
    </div>
  )
}
