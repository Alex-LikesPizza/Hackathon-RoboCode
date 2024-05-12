import React from 'react'

const PAGES = ["Home", "Game", "Contacts"];

const Header = ({currentPage, setCurrentPage}) => {

  const changeCurrentPageTo = (page) => {
    setCurrentPage(page)
  }

  let links = PAGES.filter(link => currentPage !== link);
  let linksComponent = links.map((link, index) => 
    <div onClick={() => changeCurrentPageTo(link)} className="header__link" key={index}>{link}</div>
);

  return (
    <header className="header">
      {linksComponent[0]}
      <div className="header__active-link">{currentPage}</div>
      {linksComponent[1]}
    </header>
  )
}

export default Header