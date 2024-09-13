import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Authentication from '../../Contexts/Authentication';



const Profile = () => {
    const [userData, setUserData] = useState(null);
    const ctx = useContext(Authentication);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        address: '',
        profilePicture: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!ctx.isLoggedIn || !ctx.user || !ctx.user.Id) {
                    console.error("Korisnik nije prijavljen ili korisnički ID nije dostupan");
                    return;
                }
                const response = await axios.get('https://localhost:44310/api/Authentication/profile?id='+ctx.user.Id, {
                    headers: {
                        Authorization: `Bearer ${ctx.user.Token}`
                    }
                });
                
    
                const user = response.data;
                console.log(user);
                console.log('Datum rođenja:', user.dateOfBirth);
    
                // Proveri i formatiraj datum
                const formattedDate = user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '';
    
                setUserData(user);
                setFormData({
                    ...user,
                    dateOfBirth: formattedDate, 
                    profilePicture: user.profilePicture || '',
                });
            } catch (error) {
                console.error("Greška prilikom dobijanja korisničkih podataka", error.response ? error.response.data : error);
            }
        };
    
        fetchUserData();
    }, [ctx.isLoggedIn, ctx.user]);
    

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

        console.log([...updatedFormData]);

        try {
            await axios.put('https://localhost:44310/api/Authentication/profileUpdate', updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Profil je uspešno ažuriran!');
            navigate('/dashboard'); // Preusmeri korisnika nakon uspešnog ažuriranja
        } catch (error) {
            console.error("Greška prilikom ažuriranja profila", error.response ? error.response.data : error);
            alert("Greška prilikom ažuriranja profila. Pokušajte ponovo.");
        }
    };


    const getStatusText = (isVerified) => {
        switch(isVerified) {
            case 0:
                return 'InProgress';
            case 1:
                return 'Verified';
            case 2:
                return 'Denied';
            default:
                return 'Unknown';
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
                    <input type="text" name="username" value={formData.username || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Ime:</label>
                    <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Prezime:</label>
                    <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Datum rođenja:</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Adresa:</label>
                    <input type="text" name="address" value={formData.address || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Status verifikacije:</label>
                    <p>{getStatusText(userData.isVerified)}</p>
                </div>
                <div className="form-group">
                    <label>Slika korisnika:</label>
                    <input type="file" name="image" onChange={handleImageChange}  />
                </div>
                <button type="submit">Ažuriraj profil</button>
            </form>
        </div>
    );
};

export default Profile;
