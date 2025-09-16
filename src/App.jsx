import { useState } from 'react'
import './App.css'

import Header from './Header'
import ContentList from './ContentList'
import SearchBar from './SearchBar'

function App() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <>
      <Header />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ContentList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </>
  )
}

export default App
