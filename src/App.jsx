import { useState } from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css'

import Header from './Header'
import ContentList from './ContentList'
import SearchBar from './SearchBar'
import ItemPage from './ItemPage';
import { ItemProvider } from './contexts/ItemContext';

function App() {
  const [searchTerm, setSearchTerm] = useState("greek")

  return (
    <BrowserRouter>
      <ItemProvider>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <ContentList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </>
            }
          />
          <Route path="/item/:itemId" element={<ItemPage />} />

        </Routes>
      </ItemProvider>
    </BrowserRouter>
  )
}

export default App
