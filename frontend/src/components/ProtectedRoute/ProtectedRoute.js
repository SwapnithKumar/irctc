import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Cookie from "js-cookie";

const ProtectedRoute = ({ component: Component, requiredRole, ...rest }) => {
    const jwtToken=Cookie.get("jwtToken");
    console.log(jwtToken)
    if(jwtToken === undefined) return <Navigate to="/login"/>
    const {role}=jwtDecode(jwtToken);
    if(requiredRole !== role){
       <Navigate to="/"/>
    }
  return <Component {...rest}/>
};

export default ProtectedRoute;
