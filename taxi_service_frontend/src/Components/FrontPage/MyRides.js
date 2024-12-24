import React, { useState, useEffect, useContext } from 'react';
import Authentication from '../../Contexts/Authentication';
import '../Design/myrides.css';
import { useNavigate } from 'react-router-dom';
import RideService from '../../Service/RideService';

const MyRides = () => {
  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ctx = useContext(Authentication);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        const response = await RideService.myRides(ctx.user.Token, ctx.user.Id);
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
    <div className="my-rides-container">
      <h2>My Rides</h2>
      {myRides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        <ul className="rides-list">
          {myRides.map((ride) => (
            <li key={ride.id} className="ride-item">
              <p>From: {ride.startAddress} - To: {ride.endAddress}</p>
              <p>Price: {ride.estimatedPrice}</p>
              <p>Date: {new Date(ride.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRides;
