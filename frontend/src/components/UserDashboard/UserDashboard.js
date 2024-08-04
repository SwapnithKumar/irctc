import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom';

const UserDashboard = ({ token }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [trains, setTrains] = useState([]);
  const [bookingId, setBookingId] = useState('');
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  useEffect(()=>{
    const token = Cookies.get("jwtToken");
    if(token) setIsLoggedIn(true);
    else setIsLoggedIn(false)
  },[])
  const handleCheckAvailability = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/trains/availability', { params: { source, destination } });
      setTrains(response.data.trains);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookSeat = async (trainId) => {
    const token = Cookies.get("jwtToken");

    try {
      const response = await axios.post('http://localhost:3000/api/bookings', { train_id: trainId,jwtToken:token } );
      setBookingId(response.data.booking_id);
      alert('Booking successful');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
        <div>
            <h2>User Dashboard</h2>
            <input type="text" placeholder="Source" onChange={e => setSource(e.target.value)} />
            <input type="text" placeholder="Destination" onChange={e => setDestination(e.target.value)} />
            <button onClick={handleCheckAvailability}>Check Availability</button>
            <div>
                {trains.map(train => (
                <div key={train.train_id}>
                    <h3>{train.train_name}</h3>
                    <p>Available Seats: {train.available_seats}</p>
                    <button onClick={() => handleBookSeat(train.train_id)}>Book Seat</button>
                </div>
                ))}
            </div>
            {bookingId && <p>Your Booking ID: {bookingId}</p>}
        </div>
        {!isLoggedIn && <Link to = '/login'>Login</Link>}
    </div>
  );
};

export default UserDashboard;
