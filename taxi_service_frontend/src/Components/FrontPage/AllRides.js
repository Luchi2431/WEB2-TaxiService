// components/PreviousRides.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Authentication from '../../Contexts/Authentication';
import '../Design/allrides.css';
import { useNavigate } from 'react-router-dom';
import RideService from '../../Service/RideService';

const AllRides = () => {
  const [allRides, setAllRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const ctx = useContext(Authentication);

  useEffect(() => {
    
  const fetchAllRides = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_RIDE_URL+"ride/all-rides", {
        headers: {
          Authorization: `Bearer ${ctx.user.Token}`
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Token has expired. Redirecting to the front page...");
        ctx.onLogout();
        navigate('/'); // Navigate to the front page
    } else {
        console.error('Error fetching new rides:', error);
               }
    }
  };

    const getAllRides = async () => {
      try {
        setLoading(true);
        const rides = await fetchAllRides();
        setAllRides(rides);
      } catch (err) {
        setError('Error loading all rides');
      } finally {
        setLoading(false);
      }
    };

    getAllRides();
  }, []);


  if (loading) return <div>Loading rides...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="all-rides-wrapper">
      <div className="all-rides-container">
        <h2>All Rides</h2>
        {allRides.length === 0 ? (
          <p>No rides found.</p>
        ) : (
          <ul className="rides-list">
            {allRides.map((ride) => (
              <li key={ride.id} className="ride-item">
                <p>From: {ride.startAddress} - To: {ride.endAddress}</p>
                <p>Price: {ride.estimatedPrice}</p>
                <p>Date: {new Date(ride.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  
};

export default AllRides;
