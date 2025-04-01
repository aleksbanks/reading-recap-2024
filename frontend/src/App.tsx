import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { BookList } from './components/BookList/BookList.tsx'
import { YearSelector } from './components/YearSelector/YearSelector.tsx'

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <h1>
          Reading Recap <YearSelector />
        </h1>
        <BookList />
      </QueryClientProvider>
    </Provider>
  )
}

export default App
