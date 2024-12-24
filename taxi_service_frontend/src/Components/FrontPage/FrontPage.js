import React, { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import User from '../../Models/User';
import Authentication from '../../Contexts/Authentication';
import { useContext } from 'react';
import '../Design/frontpage.css';
import AuthenticationService from '../../Service/AuthenticationService';

const FrontPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Dodaj state za poruke o grešci
    const navigate = useNavigate(); // Koristi useNavigate
    const ctx = useContext(Authentication);

    const handleFrontPage = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Resetuj poruku o grešci

        // Provera da li su uneta oba polja
        if (!email || !password) {
            setErrorMessage('Molimo unesite i email i lozinku.');
            return;
        }

        // Validacija formata e-mail adrese
        const emailRegex = /^[^\s@]+@[^\s@]/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Molimo unesite ispravan email.');
            return;
        }

        try {
            const response = await AuthenticationService.login(email, password);
            console.log('Response from server:', response.data); 
            const user = new User(response.data);
            ctx.onLogin(user);
            navigate('/dashboard');
            alert(`Logovani korisnik je ${user.Email}`);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Pogrešan email ili lozinka. Pokušajte ponovo.');
            } else {
                setErrorMessage('Došlo je do greške. Pokušajte ponovo kasnije.');
                console.error('Error during login:', error);
            }
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await AuthenticationService.googleLogin(credentialResponse.credential);
            const user = new User(response.data);
            ctx.onLogin(user);
            navigate('/dashboard');
            alert(`Logovani korisnik je ${user.Email}`);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Token je istekao. Vraćanje na početnu stranicu.');
                ctx.onLogout();
                navigate('/');
            } else {
                setErrorMessage('Došlo je do greške prilikom prijave putem Google-a.');
                console.error('Error during Google login:', error);
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Prijava na taksi servis</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Prikaz poruke o grešci */}
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

            <GoogleOAuthProvider clientId="889373334973-q56o6jqdhcip6lo9ug28pnq20jk7or29.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => setErrorMessage('Greška prilikom prijave putem Google-a')}
                />
            </GoogleOAuthProvider>
        </div>
    );
};

export default FrontPage;
