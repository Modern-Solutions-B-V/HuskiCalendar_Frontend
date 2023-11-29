import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Outlet } from "react-router-dom"
import { Container } from 'react-bootstrap'




const App = () => {
  return (
    <div>
      <ToastContainer />
      <Container className='my-2'>
        <Outlet />
      </Container>
    </div>
  )
}

export default App
