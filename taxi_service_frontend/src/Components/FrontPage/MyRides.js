// components/PreviousRides.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Authentication from '../../Contexts/Authentication';
import '../Design/myrides.css';

const MyRides = () => {
  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ctx = useContext(Authentication);

  useEffect(() => {
    
  const fetchMyRides = async () => {
    try {
      const response = await axios.get('https://localhost:44310/api/Authentication/myRides?id='+ctx.user.Id, {
        headers: {
          Authorization: `Bearer ${ctx.user.Token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my rides', error);
      throw error;
    }
  };

    const getMyRides = async () => {
      try {
        setLoading(true);
        const rides = await fetchMyRides();
        setMyRides(rides);
      } catch (err) {
        setError('Error loading my rides');
      } finally {
        setLoading(false);
      }
    };

    getMyRides();
  }, []);


  if (loading) return <div>Loading rides...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>My Rides</h2>
      {myRides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        <ul>
          {myRides.map((ride) => (
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

export default MyRides;
