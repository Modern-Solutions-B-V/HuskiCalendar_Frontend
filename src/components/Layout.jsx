import React from "react";
import "./../style/Layout.css";
import { useNavigate } from "react-router-dom";

function DefaultLayout(props) {
  const navigate=useNavigate() ;

  return (
    <div className="layout">
      <div className="header" >
        <h1 onClick={()=> navigate('/calendar')} style={{cursor:'Pointer'}}>Huski Calendar </h1>
        <button type="button" className="btn btn-block btn-outline-primary btn-sm "  onClick={()=> { localStorage.removeItem('token') ; navigate('/')}}> <i className="fa fa-sign-out-alt"> Logout</i> </button>
        
      </div>
      <div className="content">{props.children}</div>
    </div>
  );
}

export default DefaultLayout;
