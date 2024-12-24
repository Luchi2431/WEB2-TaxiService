import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Authentication from '../../Contexts/Authentication';
import '../Design/verification.css';
import VerificationService from '../../Service/VerificationService';
import RideService from '../../Service/RideService';
import UserService from '../../Service/UserService';
import { useRef } from 'react';

const Verification = () => {
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();
    const ctx = useContext(Authentication);
    const isMounted = useRef(false);

    const currentUserType = ctx.user.UserType; // Dohvati UserType iz konteksta

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await UserService.getDrivers(ctx.user.Token,ctx.user.Id);
                console.log('Fetched drivers:', response.data);
                const filteredDrivers = response.data // Filtriraj samo vozače
                setDrivers(filteredDrivers);
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
        if (!isMounted.current) {
            fetchDrivers();
            isMounted.current = true;
        }
    }, [navigate, currentUserType]);

        // Funkcije za odobravanje i odbacivanje vozača
        const handleApprove = async (id) => {
            try {
                await VerificationService.approve(ctx.user.Token,id);
                setDrivers(drivers.map(driver => driver.id === id ? { ...driver, isVerified: 1 } : driver));
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

        const handleReject = async (id) => {
            try {
                await VerificationService.reject(ctx.user.Token,id);
                setDrivers(drivers.map(driver => driver.id === id ? { ...driver, isVerified: 2 } : driver));
            } catch (error) {
                console.error('Error rejecting driver:', error);
            }
        };


        const getStatusText = (isVerified) => {
            switch(isVerified) {
                case 0:
                    return 'InProgress';
                case 1:
                    return 'Verified';
                case 2:
                    return 'Denied';
                default:
                    return 'Unknown';
            }
        };


    return (
        <div className="verification">
            <h2>Verifikacija Vozača</h2>

            
            {drivers.length === 0 ? ( // Proveri da li ima vozača
                <p>Nema vozača na verifikaciji.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ime</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map(driver => (
                            <tr key={driver.id}>
                                <td>{driver.id}</td>
                                <td>{driver.username}</td>
                                <td>{driver.email}</td>
                                <td>{getStatusText(driver.isVerified)}</td>
                                <td>
                                    {driver.isVerified === 0 && (
                                        <>
                                            <button onClick={() => handleApprove(driver.id)}>Odobri</button>
                                            <button onClick={() => handleReject(driver.id)}>Odbaci</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Verification;
