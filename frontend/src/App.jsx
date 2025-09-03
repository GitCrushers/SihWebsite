import React from 'react'
import {Routes,Route,BrowserRouter, Outlet} from "react-router-dom"
import Home from './pages/Home'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className="bg-black min-h-screen text-white">
        <Navbar/>
        <Outlet/>
     </div>
  )
}

export default App