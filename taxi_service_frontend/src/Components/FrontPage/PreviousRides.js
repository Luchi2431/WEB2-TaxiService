// components/PreviousRides.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Authentication from '../../Contexts/Authentication';
import '../Design/previousrides.css';

const PreviousRides = () => {
  const [previousRides, setPreviousRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ctx = useContext(Authentication);

  useEffect(() => {
    
  const fetchPreviousRides = async () => {
    try {
      const response = await axios.get('https://localhost:44310/api/Authentication/previousRides?id='+ctx.user.Id, {
        headers: {
          Authorization: `Bearer ${ctx.user.Token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching previous rides', error);
      throw error;
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
    <div>
      <h2>Previous Rides</h2>
      {previousRides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        <ul>
          {previousRides.map((ride) => (
            <li key={ride.id}>
              <p>From: {ride.startAdress} - To: {ride.endAdress}</p>
              <p>Price: {ride.estimatedPrice}</p>
              <p>Date: {new Date(ride.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PreviousRides;
