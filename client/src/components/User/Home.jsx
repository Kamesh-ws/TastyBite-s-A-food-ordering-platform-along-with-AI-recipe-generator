import React from 'react'
import Search from './Search'
import Cuisine from './Cuisine'
import Restarant from './Restaurant/Restarant'
import Menu from './Restaurant/Menu'
import Offer from './Offer'
import Special from './Special'
const Home = () => {
  return (
    <div>
      <Search />
      <Cuisine />
      <Offer />
      <Special/>
      <Restarant />
      <Menu />
    </div>
  )
}

export default Home