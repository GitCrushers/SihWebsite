import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Team from './pages/Team.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}>
          <Route index element={<Home/>}/>
          <Route element={<About/>} path='about'/>
          <Route element={<Dashboard/>} path='dashboard'/>
          <Route element={<Team/>} path='team'/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
