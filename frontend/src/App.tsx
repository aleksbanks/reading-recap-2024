import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BookList } from './components/BookList.tsx'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>Reading Recap 2024</h1>
      <BookList />
    </QueryClientProvider>
  )
}

export default App
