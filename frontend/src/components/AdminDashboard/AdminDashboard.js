import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const AdminDashboard = ({ token }) => {
  const [trainId, setTrainId] = useState('');
  const [trainName, setTrainName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const secret = 'your_secret_key';
  const jwtToken = Cookies.get('jwtToken');
  const user = jwtDecode(jwtToken,secret);
  console.log(user.role)

  const handleAddTrain = async () => {

    try {
      await axios.post('http://localhost:3000/api/trains', 
      { train_id: trainId, train_name: trainName, source, destination, total_seats: totalSeats,jwtToken:jwtToken }, 
      { headers: { Authorization: `Bearer ${token}` } });
      alert('Train added successfully');
    } catch (error) {
      console.error(error);
    }
  };

  if(user.role !== 'admin') <Navigate to ='/'/>

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <input type="text" placeholder="Train ID" onChange={e => setTrainId(e.target.value)} />
      <input type="text" placeholder="Train Name" onChange={e => setTrainName(e.target.value)} />
      <input type="text" placeholder="Source" onChange={e => setSource(e.target.value)} />
      <input type="text" placeholder="Destination" onChange={e => setDestination(e.target.value)} />
      <input type="number" placeholder="Total Seats" onChange={e => setTotalSeats(e.target.value)} />
      <button onClick={handleAddTrain}>Add Train</button>
    </div>
  );
};

export default AdminDashboard;
