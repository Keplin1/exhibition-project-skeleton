import { useState } from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css'

import Header from './Header'
import ContentList from './ContentList'
import SearchBar from './SearchBar'
import ItemPage from './ItemPage';
import { ItemProvider } from './contexts/ItemContext';
import { CollectionProvider } from './contexts/CollectionContext';
import CollectionPage from './CollectionPage';
import ScrollToTop from './ScrollToTop';

function App() {
  const [searchTerm, setSearchTerm] = useState("greek")

  return (
    <BrowserRouter>
      <ItemProvider>
        <CollectionProvider>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                  <ContentList searchTerm={searchTerm} />
                </>
              }
            />
            <Route path="/item/:itemId" element={<ItemPage />} />
            <Route path="/collection" element={<CollectionPage />} />
          </Routes>
          <ScrollToTop />
        </CollectionProvider>
      </ItemProvider>
    </BrowserRouter>
  )
}

export default App
