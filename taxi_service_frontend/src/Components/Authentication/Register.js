import React, { useState } from 'react';
import axios from 'axios';
//import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
//import './Register.css';

const Register = () => {
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
            const response = await axios.post('https://localhost:44310/api/Authentication/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Uveri se da postavljaš ispravan Content-Type
                },
            });
            console.log("Odgovor sa servera:", response.data);
            alert('Registracija uspešna! Molimo sačekajte potvrdu od administratora.');
        } catch (error) {
            if (error.response) {
                console.error("Greška prilikom registracije", error.response.data);
            } else {
                console.error("Greška prilikom registracije", error);
            }
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post('YOUR_API_ENDPOINT/auth/google', {
                token: credentialResponse.credential,
            });
            console.log("Korisnik prijavljen putem Google-a:", response.data);
            // Ovde možete obraditi dodatnu logiku, kao što je preusmeravanje korisnika na dashboard
        } catch (error) {
            console.error("Greška prilikom prijave putem Google-a", error);
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
                    <select name="userType" value={formData.userType} onChange={handleChange}>
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
            {/* <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => console.log('Greška prilikom prijave putem Google-a')}
                />
            </GoogleOAuthProvider> */}
        </div>
    );
};

export default Register;