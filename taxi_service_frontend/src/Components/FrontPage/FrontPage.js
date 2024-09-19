import React, { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import User from '../../Models/User';
import Authentication from '../../Contexts/Authentication';
import { useContext } from 'react';
import '../Design/frontpage.css';

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
            
            const response = await axios.post("https://localhost:44310/api/Authentication/login", JSON.stringify({ Email: email , Password: password }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response from server:', response.data); // Loguj ceo odgov
            const user = new User(response.data);
            authCtx.onLogin(user);
            navigate('/dashboard')
            alert(`Logovani korisnik je ${user.Email}`);
            

          } catch (error) {
            alert(error.response.data.detail);
        }


        console.log('Prijava sa', email, password);
    };

    const handleRegister = () => {
        navigate('/register'); // Navigacija na stranicu za registraciju
    };
    
    const handleGoogleLoginSuccess = async (credentialResponse) => {

        try {
            const response = await axios.post('https://localhost:44310/api/Authentication/googleLogin', JSON.stringify(credentialResponse.credential), 
                {
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                });
            const user = new User(response.data);
            authCtx.onLogin(user);
            navigate('/dashboard');
            alert(`Logovani korisnik je ${user.Email}`);
        } catch (error) {
            console.error("Greška prilikom prijave putem Google-a", error.response ? error.response.data : error);
        }
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

            {/* Google Login Integration */}
        <GoogleOAuthProvider clientId="889373334973-q56o6jqdhcip6lo9ug28pnq20jk7or29.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => console.log('Greška prilikom prijave putem Google-a')}
            />
        </GoogleOAuthProvider>


        </div>

    

    
    

    );
};

export default FrontPage;