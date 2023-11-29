import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import Login from './components/Login';
import Register from './components/Register';
import ActivationEmail from './components/ActivationEmail';
import { Routes, Route } from "react-router-dom"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-datepicker/dist/react-datepicker.css";
import Calend from './components/Calendar';
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './components/ResetPassword';
import ResetPage from './components/ResetPage';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activationemail/:activation_token" element={<ActivationEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/resetPage/:id/:token" element={<ResetPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/calendar" element={<Calend />} />
        </Route>

      </Route>
    </Routes>


  </BrowserRouter>


);

