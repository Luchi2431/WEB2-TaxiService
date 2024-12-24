import { useContext } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import Authentication from '../../Contexts/Authentication';
import { useNavigate } from 'react-router-dom';
import '../Design/sidebar.css';

const Sidebar = () => {
    const ctx = useContext(Authentication);
    const currentUserType = ctx.user?.UserType;
    
    // Pretvaramo IsVerified u broj (u slučaju da dolazi kao string)
    const isDriverVerified = Number(ctx.user?.IsVerified) === 2;
    
    const navigate = useNavigate();

    const handleLogout = () => {
        ctx.onLogout(); // Pozovi logout metodu iz context-a
        navigate('/'); // Vrati korisnika na početnu stranicu
        alert('Uspešno ste se odjavili.');
    };

    return (
        <div className="sidebar">
            <h2>Taxi Aplikacija</h2>
            <ul>
                <li><Link to="/dashboard/profile">Profil</Link></li>
                <li><Link to="/dashboard/new-ride">Nova vožnja</Link></li>
                {currentUserType === 1 && (
                    <li><Link to="/dashboard/previous-rides">Prethodne vožnje</Link></li>
                )}
                {currentUserType === 0 && (
                    <li><Link to="/dashboard/verification">Verifikacija</Link></li>
                    
                )}

                {currentUserType === 0 && (
                    <li><Link to="/dashboard/all-rides">Sve vožnje</Link></li>
                    
                )}

                

                {/* Provera da li je vozač verifikovan */}
                {currentUserType === 2 && !isDriverVerified && (
                    <li><Link to="/dashboard/new-rides-for-drivers">Nove vožnje</Link></li>
                )}

                
                {currentUserType === 2 && (
                    <li><Link to="/dashboard/myRides">Moje vožnje</Link></li>
                )}
            </ul>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Sidebar;
