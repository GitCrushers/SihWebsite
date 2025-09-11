import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Team from './pages/Team.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Surveliance from './pages/Surveliance.jsx'
import Notification from './pages/Notification.jsx'
import Forecasting from './pages/Forecasting.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}>
          <Route index element={<Home/>}/>
          <Route element={<About/>} path='about'/>
          <Route path="dashboard" element={<Dashboard />}/>
          <Route path='dashboard/surveliance' element={<Surveliance/>}/>
          <Route path='notifications' element={<Notification/>}/>
          <Route path='forecasting' element={<Forecasting/>} />
          <Route element={<Team/>} path='team'/>
          <Route element={<Login/>} path='login'/>
          <Route element={<Register/>} path='register'/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
