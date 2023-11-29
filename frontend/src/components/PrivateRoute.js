import React from 'react'
import { Outlet, Navigate } from "react-router-dom"
import jwt_decode from 'jwt-decode';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = jwt_decode(token)
        const expirationDate = new Date(payload.exp * 1000);
        if (expirationDate < new Date()) {
            localStorage.removeItem('token');
            return <Navigate to="/" />;
        }
    } return (
        token ? <Outlet /> : <Navigate to="/" />)
}

export default PrivateRoute
