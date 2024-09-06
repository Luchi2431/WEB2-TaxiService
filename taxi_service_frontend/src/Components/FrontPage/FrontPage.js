import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Uvezi useHistory
// import './Login.css'; // Za stilizaciju (opciono)

const FrontPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Koristi useNavigate

    const handleFrontPage = (e) => {
        e.preventDefault();
        // Ovde ide logika za prijavu
        console.log('Prijava sa', username, password);
    };

    const handleRegister = () => {
        navigate('/register'); // Navigacija na stranicu za registraciju
    };

    return (
        <div className="login-container">
            <h2>Prijava na taksi servis</h2>
            <form onSubmit={handleFrontPage}>
                <div className="form-group">
                    <label>Korisničko ime:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Lozinka:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Prijava</button>
            </form>
            <button onClick={handleRegister} className="register-button">
                Registracija
            </button>
        </div>
    );
};

export default FrontPage;