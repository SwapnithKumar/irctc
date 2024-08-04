import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3000/api/register', { username, password, role });
      alert('User registered successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <select onChange={e => setRole(e.target.value)} value={role}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};

export default Register;
