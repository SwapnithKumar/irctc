import React, { useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/login', { username, password });
      const {token}=await response.data;
      Cookies.set("jwtToken", token, {expires: 1});
      const {role} = jwtDecode(token);
      if(role === "admin") navigate("/admin")
      else navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
};

export default Login;
