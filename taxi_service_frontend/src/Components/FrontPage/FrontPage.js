import React, { useState } from 'react';
import axios from 'axios';
import { GoogleAuthProvider } from 'firebase/auth/web-extension';
import { useNavigate } from 'react-router-dom';
import User from '../../Models/User';
import Authentication from '../../Contexts/Authentication';
import { useContext } from 'react';

// Uvezi useHistory
// import './Login.css'; // Za stilizaciju (opciono)

const FrontPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Koristi useNavigate
    const authCtx = useContext(Authentication);

    const handleFrontPage = async(e) => {
        e.preventDefault();
        // Ovde ide logika za prijavu
        console.log('Slanje podataka:', { Email: email, Password: password });
        try {
            
            const response = await axios.post("https://localhost:44310/api/Authentication/login", JSON.stringify({ Email: 'da@da', Password: 'da' }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const user = new User(response.data);
            authCtx.onLogin(user);
            navigate('/dashboard')
          } catch (error) {
            alert(error.response.data.detail);
        }


        console.log('Prijava sa', email, password);
    };

    const handleRegister = () => {
        navigate('/register'); // Navigacija na stranicu za registraciju
    };

    return (
        <div className="login-container">
            <h2>Prijava na taksi servis</h2>
            <form onSubmit={handleFrontPage}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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