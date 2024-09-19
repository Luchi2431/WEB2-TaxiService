import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Authentication from '../../Contexts/Authentication';
import { useContext } from 'react';
import RideContext from '../../Contexts/RideContext';
import '../Design/newride.css';

const NewRide = () => {
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [priceEstimate, setPriceEstimate] = useState(null);
    const [Estimatedtime, setWaitTimeEstimate] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const ctx = useContext(Authentication);
    const rideCtx = useContext(RideContext);
    const [arrivalCountdown, setArrivalCountdown] = useState(null);
    const [rideCountdown, setRideCountdown] = useState(null);
    const [rideCompleted, setRideCompleted] = useState(false);
    const [rating, setRating] = useState(0);
    const [blocked, setBlocked] = useState(true);

    useEffect(() => {
        if (rideCtx.currentRide) {
            console.log("Current ride in countdown: ", rideCtx.currentRide);
            const estimatedArrivalTime = rideCtx.currentRide?.estimatedArrivalTime?.seconds;
            if (estimatedArrivalTime) {
                setArrivalCountdown(estimatedArrivalTime);
                const arrivalTimer = setInterval(() => {
                    setArrivalCountdown((prev) => {
                        if (prev <= 0) {
                            clearInterval(arrivalTimer);
                            return 0; // Zaustavi odbrojavanje na nuli
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }
    }, [rideCtx.currentRide]);

    useEffect(() => {
        if (arrivalCountdown === 0 && rideCtx.currentRide) {
            const estimatedTime = rideCtx.currentRide?.estimatedTime?.seconds;
            if (estimatedTime) {
                setRideCountdown(estimatedTime);
                const rideTimer = setInterval(() => {
                    setRideCountdown((prev) => {
                        if (prev <= 0) {
                            clearInterval(rideTimer);
                            setRideCompleted(true);
                            setBlocked(false);
                            return 0; // Zaustavi odbrojavanje na nuli
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }
    }, [arrivalCountdown, rideCtx.currentRide]);    

    useEffect(() => {
        if (rideCountdown === 0) {
            setRideCompleted(true);
            setBlocked(false);
        }
    }, [rideCountdown]);

    const handleOrderRide = async () => {
        try {
            const response = await axios.post('https://localhost:44310/api/Authentication/estimate', { startAddress, endAddress });
            const price = response.data.estimatedPrice;
            const EstimatedTime = response.data.estimatedTime;
            setPriceEstimate(price);
            setWaitTimeEstimate(EstimatedTime);
        } catch (error) {
            console.error('Error while estimating ride:', error);
        }
    };

    const handleConfirmRide = async () => {
        try {
            const timeSpan = `${Estimatedtime?.days || 0}.${Estimatedtime?.hours || 0}:${Estimatedtime?.minutes || 0}:${Estimatedtime?.seconds || 0}`; // Check for existence
            const formData = {
                userId: ctx.user.Id,
                driverId: 0,
                startAddress: startAddress,
                endAddress: endAddress,
                estimatedPrice: priceEstimate,
                estimatedTime: timeSpan,
                estimatedArrivalTime: 0,
                rideStatus: 0,
                createdAt: new Date().toISOString(),
                Rating: 0
            }

            console.log('FormData before sending:', formData);
            await axios.post('https://localhost:44310/api/Authentication/confirm', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setConfirmed(true);
        } catch (error) {
            console.error('Error while confirming ride:', error);
        }
    };

    return (
        <div className="new-ride">
            <h2>Nova Vožnja</h2>
            {!confirmed ? (
                <>
                    <input
                        type="text"
                        placeholder="Početna adresa"
                        value={startAddress}
                        onChange={(e) => setStartAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Krajnja adresa"
                        value={endAddress}
                        onChange={(e) => setEndAddress(e.target.value)}
                    />
                    <button onClick={handleOrderRide}>Poruči</button>

                    {priceEstimate && Estimatedtime && (
                        <div>
                            <p>Predviđena cena: {priceEstimate} din</p>
                            <p>Vreme čekanja: {Estimatedtime?.seconds || 0} sekundi</p>
                            <button onClick={handleConfirmRide}>Potvrdi</button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {arrivalCountdown > 0 ? (
                        <p>Vozač stiže za {arrivalCountdown} sekundi...</p>
                    ) : rideCountdown > 0 ? (
                        <p>Voznja traje: {rideCountdown} sekundi...</p>
                    ) : (
                        rideCompleted && (
                            <>
                                <p>Voznja je završena. Molimo ocenite vozača:</p>
                                {/* <div>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => handleRating(star)}>
                                            {star} Zvezdica
                                        </button>
                                    ))}
                                </div> */}
                            </>
                        )
                    )}
                </>
            )}
            {blocked && (
                <p>Sistem je zaključan, molimo sačekajte završetak vožnje...</p>
            )}
            {!blocked && (
                <p>Možete ponovo koristiti sve funkcionalnosti sistema.</p>
            )}
        </div>
    );
};

export default NewRide;
