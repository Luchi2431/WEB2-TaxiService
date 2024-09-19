import React, { useState } from 'react';
import Ride from '../Models/Ride';
import { useEffect } from 'react';

// Create the Ride context with default values
const RideContext = React.createContext({
    currentRide: null,
    onRequestRide: (ride) => {},
    onCancelRide: () => {},
});

export const RideProvider = (props) => {
    // State to hold the current ride details (no localStorage)
    const [currentRide, setCurrentRide] = useState(null);

    // Handler to request a ride and update state
    const requestRideHandler = (ride) => {
            // Provera pre postavljanja
            setCurrentRide(ride); // Update the ride in state
              
    }

    useEffect(() => {
        console.log("Current ride after setting: ", currentRide);
    }, [currentRide]);

    // Handler to cancel the ride
    const cancelRideHandler = () => {
        setCurrentRide(null); // Reset the current ride state
    }

    return (
        <RideContext.Provider
            value={{
                currentRide: currentRide,
                onRequestRide: requestRideHandler,
                onCancelRide: cancelRideHandler,
            }}
        >
            {props.children}
        </RideContext.Provider>
    )
}

export default RideContext;
