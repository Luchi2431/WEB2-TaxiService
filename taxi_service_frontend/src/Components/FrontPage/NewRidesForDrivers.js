import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Authentication from '../../Contexts/Authentication';
import { useContext } from 'react';
import RideContext from '../../Contexts/RideContext';
import Ride from '../../Models/Ride';
import '../Design/newridesfordrivers.css';

const NewRidesForDrivers = () => {
    const [newRides, setNewRides] = useState([]);
    const ctx = useContext(Authentication);
    const rideCtx = useContext(RideContext);
    const [arrivalCountdown, setArrivalCountdown] = useState(null);
    const [rideCountdown, setRideCountdown] = useState(null);
    const [rideCompleted, setRideCompleted] = useState(false);
    const [rating, setRating] = useState(0);
    const [blocked, setBlocked] = useState(true);

    useEffect(() => {
        let rideTimer;
        if (arrivalCountdown === 0) {
            const estimatedTime = rideCtx.currentRide?.estimatedTime?.seconds; // Check for existence
            if (estimatedTime) {
                setRideCountdown(estimatedTime);
                rideTimer = setInterval(() => {
                    setRideCountdown((prev) => prev > 0 ? prev - 1 : 0);
                }, 1000);
            }
        }
        
        return () => clearInterval(rideTimer);
    }, [arrivalCountdown]);

    useEffect(() => {
        if (rideCountdown === 0) {
            setRideCompleted(true);
            setBlocked(false);  // Odblokiraj vozača nakon vožnje
        }
    }, [rideCountdown]);

    useEffect(() => {
        const fetchNewRides = async () => {
            try {
                const response = await axios.get('https://localhost:44310/api/Authentication/new-rides');
                setNewRides(response.data);
            } catch (error) {
                console.error('Error fetching new rides:', error);
            }
        };

        fetchNewRides();
    }, []);

    const handleAcceptRide = async (rideId) => {
        try {
            const acceptedRideData = await axios.post(`https://localhost:44310/api/Authentication/accept`, {
                rideId: rideId,
                driverId: ctx.user.Id
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });


            if (acceptedRideData && acceptedRideData.data) {
                const ride = new Ride(acceptedRideData.data);
                rideCtx.onRequestRide(ride);
                alert("Voznja je prihvacena!");
            } else {
                console.error("Accepted ride data is null or invalid");
            }
        } catch (error) {
            console.error('Error accepting ride:', error);
        }
    };

    useEffect(() => {
        if (rideCtx.currentRide) {
            console.log("Current ride in countdown: ", rideCtx.currentRide);
        }
        let arrivalTimer;
        const estimatedArrivalTime = rideCtx.currentRide?.estimatedArrivalTime?.seconds; // Check for existence
        if (arrivalCountdown && estimatedArrivalTime) {
            setArrivalCountdown(estimatedArrivalTime);
            arrivalTimer = setInterval(() => {
                setArrivalCountdown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(arrivalTimer);
    }, [rideCtx.currentRide]);

    return (
        <div className="new-rides">
            <h2>Nova Vožnja za Vozače</h2>
            <ul>
                {newRides.map((ride) => (
                    <li key={ride.id}>
                        {ride.startAddress} - {ride.endAddress}
                        <button onClick={() => handleAcceptRide(ride.id)}>Prihvati</button>
                    </li>
                ))}
            </ul>
            {blocked && (
                <p>Sistem je zaključan, molimo sačekajte završetak vožnje...</p>
            )}
            {!blocked && (
                <p>Možete ponovo koristiti sve funkcionalnosti sistema.</p>
            )}
        </div>
    );
};

export default NewRidesForDrivers;
