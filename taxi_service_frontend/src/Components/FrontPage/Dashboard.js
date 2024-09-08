import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Profile from './Profile';
import NewRide from './NewRide';
import PreviousRides from './PreviousRides';
import Verification from './Verification';
import NewRidesForDrivers from './NewRidesForDrivers';
import AllRides from './AllRides';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="dashboard-content">
                
                    {/* Koristimo * na roditeljskom path-u */}
                   
                        <Routes>
                            <Route path="profile" element={<Profile />} />
                            <Route path="new-ride" element={<NewRide />} />
                            <Route path="previous-rides" element={<PreviousRides />} />
                            <Route path="verification" element={<Verification />} />
                            <Route path="new-rides-for-drivers" element={<NewRidesForDrivers />} />
                            <Route path="all-rides" element={<AllRides />} />
                            <Route path="/" element={<h2>Dobrodošli na Dashboard</h2>} />
                        </Routes>
               
            </div>
        </div>
    );
};

export default Dashboard;
