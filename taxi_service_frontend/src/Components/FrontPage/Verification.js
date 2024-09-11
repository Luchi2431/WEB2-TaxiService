import React, {useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Authentication from '../../Contexts/Authentication';

const Verification = () => {
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();
    const ctx = useContext(Authentication);

    const currentUserType = ctx.user.UserType; // Dohvati UserType iz konteksta

    useEffect(() => {     

        const fetchDrivers = async () => {
            try {
                const response = await axios.get('https://localhost:44310/api/Authentification/getUsers');
                const filteredDrivers = response.data.filter(user => user.userType === 'driver'); // Filtriraj samo vozače
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
            await axios.put(`https://localhost:44310/api/admin/approve/${id}`);
            setDrivers(drivers.map(driver => driver.id === id ? { ...driver, status: 'Approved' } : driver)); // Ažuriraj status lokalno
        } catch (error) {
            console.error('Error approving driver:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`https://localhost:44310/api/admin/reject/${id}`);
            setDrivers(drivers.map(driver => driver.id === id ? { ...driver, status: 'Rejected' } : driver)); // Ažuriraj status lokalno
        } catch (error) {
            console.error('Error rejecting driver:', error);
        }
    };

    return (
        <div className="verification">
            <h2>Verifikacija Vozača</h2>

            <h3>Svi Vozači</h3>
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
                            <td>{driver.name}</td>
                            <td>{driver.email}</td>
                            <td>{driver.status}</td>
                            <td>
                                {driver.status !== 'Approved' && (
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
        </div>
    );
};

export default Verification;
