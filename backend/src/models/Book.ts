import mongoose, { Schema, Document } from 'mongoose'

export interface IBook extends Document {
  title: string
  author: string
  pages: number
  genres: string[]
  language: string
  format: 'ebook' | 'audio' | 'physical book'
  dateStart: Date
  dateEnd: Date
  haveAtLeastOneSmutScene?: boolean
  rating?: number
  isBookClubChoice?: boolean
  isQueer?: boolean
  isFirstTimeRead?: boolean
  year?: number
  month?: number
}

const bookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: Number, required: true },
    genres: { type: [String], required: true },
    language: { type: String, required: false, default: 'english' },
    format: {
      type: String,
      enum: ['ebook', 'audio', 'physical book'],
      required: false,
      default: 'ebook'
    },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: false },
    haveAtLeastOneSmutScene: { type: Boolean, default: false },
    rating: { type: Number, match: /^(\d+(\.\d{1,2})?)$/, min: 0.0, max: 5.0 },
    isBookClubChoice: { type: Boolean, default: false },
    isQueer: { type: Boolean, default: true },
    isFirstTimeRead: { type: Boolean, default: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true }
  },
  {
    timestamps: true
  }
)

const Book = mongoose.model<IBook>('Book', bookSchema)

export default Book
