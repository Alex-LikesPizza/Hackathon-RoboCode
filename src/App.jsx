import React from 'react'

import Footer from './layout/Footer'
import Header from './layout/Header'

import Home from './pages/Home';
import Game from './pages/Game';
import Contacts from './pages/Contacts';

function App() {
  const [ currentPage, setCurrentPage ] = React.useState("Home")
  
  return (
    <main className="page-container">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      {currentPage === "Home" && <Home/>}
      {currentPage === "Game" && <Game/>}
      {currentPage === "Contacts" && <Contacts/>}
      
      <Footer />
    </main>
  )
}

export default App
