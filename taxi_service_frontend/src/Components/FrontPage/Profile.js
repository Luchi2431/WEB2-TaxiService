import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        address: '',
        profilePicture: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://localhost:44310/api/Authentication/profile'); // Zameniti sa tačnim URL-om
                setUserData(response.data);
                setFormData(response.data); // Inicijalizuj formData sa dobijenim korisničkim podacima
            } catch (error) {
                console.error("Greška prilikom dobijanja korisničkih podataka", error.response ? error.response.data : error);
            }
        };

        fetchUserData();
    }, []);

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
            profilePicture: file,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const updatedFormData = new FormData();
        for (const key in formData) {
            updatedFormData.append(key, formData[key]);
        }

        try {
            await axios.put('https://localhost:44310/api/Authentication/profile', updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Profil je uspešno ažuriran!');
            navigate('/dashboard'); // Preusmeri korisnika nakon uspešnog ažuriranja
        } catch (error) {
            console.error("Greška prilikom ažuriranja profila", error.response ? error.response.data : error);
        }
    };

    if (!userData) {
        return <p>Učitavanje korisničkih podataka...</p>; // Prikaži poruku dok se podaci učitavaju
    }

    return (
        <div>
            <h2>Profil Korisnika</h2>
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
                    <label>Profilna slika:</label>
                    <input type="file" name="profilePicture" onChange={handleImageChange} />
                </div>
                <button type="submit">Ažuriraj profil</button>
            </form>
        </div>
    );
};

export default Profile;
