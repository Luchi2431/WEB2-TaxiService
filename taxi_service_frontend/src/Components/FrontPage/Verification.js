import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Authentication from '../../Contexts/Authentication';
import '../Design/verification.css';

const Verification = () => {
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();
    const ctx = useContext(Authentication);

    const currentUserType = ctx.user.UserType; // Dohvati UserType iz konteksta

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await axios.get('https://localhost:44310/api/Authentication/getDrivers?id='+ctx.user.Id, {
                    headers: {
                        Authorization: `Bearer ${ctx.user.Token}`
                    }
                });
                console.log('Fetched drivers:', response.data);
                const filteredDrivers = response.data // Filtriraj samo vozače
                setDrivers(filteredDrivers);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        fetchDrivers();
    }, [navigate, currentUserType]);

        // Funkcije za odobravanje i odbacivanje vozača
        const handleApprove = async (id) => {
            try {
                await axios.put(`https://localhost:44310/api/Authentication/approve?id=${id}`, {}, {
                    headers: { Authorization: `Bearer ${ctx.user.Token}` }
                });
                setDrivers(drivers.map(driver => driver.id === id ? { ...driver, isVerified: 'Verified' } : driver));
            } catch (error) {
                console.error('Error approving driver:', error);
            }
        };

        const handleReject = async (id) => {
            try {
                await axios.put(`https://localhost:44310/api/Authentication/reject?id=${id}`, {}, {
                    headers: { Authorization: `Bearer ${ctx.user.Token}` }
                });
                setDrivers(drivers.map(driver => driver.id === id ? { ...driver, isVerified: 'Denied' } : driver));
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
