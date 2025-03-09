import { useDispatch, useSelector } from 'react-redux'
import { setYear } from '../../redux/selectedYear/yearSlice'
import { selectSelectedYear } from '../../redux/selectedYear/selectors'

export function YearSelector() {
  const selectedYear = useSelector(selectSelectedYear)
  const dispatch = useDispatch()

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => currentYear - i)

  return (
    <select value={selectedYear} onChange={(e) => dispatch(setYear(Number(e.target.value)))} className='year-selector'>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  )
}
