import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Profile from '../DashboardPages/Profile';
import NewRide from './NewRide';
import PreviousRides from './PreviousRides';
import Verification from './Verification';
import NewRidesForDrivers from './NewRidesForDrivers';
import AllRides from './AllRides';
import Authentication from '../../Contexts/Authentication';
import MyRides from './MyRides';
import '../Design/dashboard.css'; // Proveri da stilizuješ dugme u CSS-u


const Dashboard = () => {
    const ctx = useContext(Authentication);
    const currentUserType = ctx.user?.UserType;
    

    console.log('Current UserType:', currentUserType); // Dodaj proveru

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="dashboard-content">
                <Routes>
                    <Route path="profile" element={<Profile />} />
                    <Route path="new-ride" element={<NewRide />} />
                    {currentUserType === 1 ? (
                        <Route path="previous-rides" element={<PreviousRides />} />
                    ) : (
                        <Route
                            path="previous-rides"
                            element={<h2>Nemate dozvolu da pristupite ovoj stranici jer niste Korisnik.</h2>}
                        />
                    )}

                    {currentUserType === 2 ? (
                        <Route path="myRides" element={<MyRides />} />
                    ) : (
                        <Route
                            path="myRides"
                            element={<h2>Nemate dozvolu da pristupite ovoj stranici jer niste driver.</h2>}
                        />
                    )}

                    {currentUserType === 0 ? (
                        <Route path="verification" element={<Verification />} />
                    ) : (
                        <Route
                            path="verification"
                            element={<h2>Nemate dozvolu da pristupite ovoj stranici jer niste administrator.</h2>}
                        />
                    )}
                    <Route path="new-rides-for-drivers" element={<NewRidesForDrivers />} />
                    <Route path="all-rides" element={<AllRides />} />
                    <Route path="/" element={<h2>Dobrodošli na Dashboard</h2>} />
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;
