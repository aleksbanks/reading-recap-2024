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
  isSmut?: boolean
  rating?: number
  isBookClubChoice?: boolean
  isQueer?: boolean
  isFirstTimeRead?: boolean
}

const bookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: Number, required: true },
    genres: { type: [String], required: true },
    language: { type: String, required: true },
    format: {
      type: String,
      enum: ['ebook', 'audio', 'physical book'],
      required: true
    },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    isSmut: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5 },
    isBookClubChoice: { type: Boolean, default: false },
    isQueer: { type: Boolean, default: false },
    isFirstTimeRead: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
)

const Book = mongoose.model<IBook>('Book', bookSchema)

export default Book
