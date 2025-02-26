export interface Book {
  _id: string
  title: string
  author: string
  pages: number
  genres: string[]
  language: string
  format: 'ebook' | 'audio' | 'physical book'
  dateStart?: string | Date | null
  dateEnd?: string | Date | null
  haveAtLeastOneSmutScene?: boolean
  rating?: number
  isBookClubChoice?: boolean
  isQueer?: boolean
  isFirstTimeRead?: boolean
  year: number
  month: number
}
