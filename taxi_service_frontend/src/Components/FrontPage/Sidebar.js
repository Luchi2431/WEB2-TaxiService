
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Taxi Aplikacija</h2>
            <ul>
                <li><Link to="/dashboard/profile">Profil</Link></li>
                <li><Link to="/dashboard/new-ride">Nova vožnja</Link></li>
                <li><Link to="/dashboard/previous-rides">Prethodne vožnje</Link></li>
                <li><Link to="/dashboard/verification">Verifikacija</Link></li>
                <li><Link to="/dashboard/new-rides-for-drivers">Nove vožnje</Link></li>
                <li><Link to="/dashboard/all-rides">Sve vožnje</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;