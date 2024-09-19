// components/PreviousRides.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Authentication from '../../Contexts/Authentication';
import '../Design/allrides.css';

const AllRides = () => {
  const [allRides, setAllRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ctx = useContext(Authentication);

  useEffect(() => {
    
  const fetchAllRides = async () => {
    try {
      const response = await axios.get('https://localhost:44310/api/Authentication/allRides', {
        headers: {
          Authorization: `Bearer ${ctx.user.Token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all rides', error);
      throw error;
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
    <div>
      <h2>All Rides</h2>
      {allRides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        <ul>
          {allRides.map((ride) => (
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

export default AllRides;
