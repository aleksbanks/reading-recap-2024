export interface Book {
  _id: string
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
}
