import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {GoogleOAuthProvider,GoogleLogin} from '@react-oauth/google';
import '../Design/register.css';



const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        address: '',
        userType: '1',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            image: file
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Lozinke se ne poklapaju!");
            return;
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        for (let [key, value] of formDataToSend.entries()) {
            console.log('${key}:', value);
        }

        try {
            const response = await axios.post(process.env.REACT_APP_AUTHENTICATION_URL+"authentication/register", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Uveri se da postavljaš ispravan Content-Type
                },
            });
            console.log("Odgovor sa servera:", response.data);
            alert('Registracija uspešna!');
            navigate('/')
        } catch (error) {
            if (error.response) {
                console.error("Greška prilikom registracije", error.response.data);
            } else {
                console.error("Greška prilikom registracije", error);
            }
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {

        const selectedOption = document.querySelector('input[name="accType"]:checked').value;
    
        try {
            const response = await axios.post(process.env.REACT_APP_AUTHENTICATION_URL+"authentication/google-register", 
                {
                    token: credentialResponse.credential, // Ovdje šalješ idToken
                    userType: selectedOption // Ovdje šalješ userType
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                });
            console.log("Korisnik registrovan putem Google-a:", response.data);
            alert('Registracija uspešna!');
            navigate('/');
        } catch (error) {
            console.error("Greška prilikom registracije putem Google-a", error.response ? error.response.data : error);
        }
    };

    return (
        <div className="register-container">
            <h2>Registracija na taksi servis</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Korisničko ime:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Lozinka:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Potvrdi lozinku:</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Ime:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Prezime:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Datum rođenja:</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Adresa:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Tip korisnika:</label>
                    <select name="userTypes" value={formData.userTypes} onChange={handleChange}>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                        <option value="Driver">Driver</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Slika korisnika:</label>
                    <input type="file" name="image" onChange={handleImageChange} required />
                </div>


                <button type="submit">Registruj se</button>
            </form>


     <hr/>
     <br/>

     <div id="accType" >
        <input type="radio" value="User" name="accType" defaultChecked /> Korisnik
        <input type="radio" value="Driver" name="accType" /> Vozac
     </div>

     {/* Google Login Integration */}
     <GoogleOAuthProvider clientId="889373334973-q56o6jqdhcip6lo9ug28pnq20jk7or29.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => console.log('Greška prilikom registracije putem Google-a')}
                />
            </GoogleOAuthProvider>
        </div>
    );
};

export default Register;