// components/PreviousRides.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Authentication from '../../Contexts/Authentication';
import '../Design/previousrides.css';
import { useNavigate } from 'react-router-dom';

const PreviousRides = () => {
  const [previousRides, setPreviousRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ctx = useContext(Authentication);
  const navigate = useNavigate();

  useEffect(() => {
    
  const fetchPreviousRides = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_RIDE_URL+"ride/previousRides?id="+ctx.user.Id, {
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

    const getPreviousRides = async () => {
      try {
        setLoading(true);
        const rides = await fetchPreviousRides();
        setPreviousRides(rides);
      } catch (err) {
        setError('Error loading previous rides');
      } finally {
        setLoading(false);
      }
    };

    getPreviousRides();
  }, []);


  if (loading) return <div>Loading rides...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="previous-rides-wrapper">
      <div className="previous-rides-container">
        <h2 className="previous-rides-title">Previous Rides</h2>
        {previousRides.length === 0 ? (
          <p className="no-rides-message">No rides found.</p>
        ) : (
          <ul className="previous-rides-list">
            {previousRides.map((ride) => (
              <li key={ride.id} className="previous-rides-item">
                <p className="previous-rides-info">From: {ride.startAddress} - To: {ride.endAddress}</p>
                <p className="previous-rides-info">Price: {ride.estimatedPrice}</p>
                <p className="previous-rides-info">Date: {new Date(ride.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  
};

export default PreviousRides;
