import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Authentication from '../../Contexts/Authentication';
import '../Design/profile.css';
import AuthenticationService from '../../Service/AuthenticationService';
import Verification from '../FrontPage/Verification';
import VerificationService from '../../Service/VerificationService';
import UserService from '../../Service/UserService';




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
                const response = await UserService.profile(ctx.user.Token,ctx.user.Id)
    
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
                if (error.response && error.response.status === 401) {
                    alert("Token has expired. Redirecting to the front page...");
                    ctx.onLogout();
                    navigate('/'); // Navigate to the front page
                } else {
                    console.error('Error fetching new rides:', error);
                }
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
            await UserService.updateProfile(ctx.user.Token,updatedFormData);
            alert('Profil je uspešno ažuriran!');
            navigate('/dashboard'); // Preusmeri korisnika nakon uspešnog ažuriranja
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Token has expired. Redirecting to the front page...");
                ctx.onLogout();
                navigate('/'); // Navigate to the front page
            } else {
                console.error('Error fetching new rides:', error);
               }
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

    console.log(formData.profilePicture);
    if (!userData) {
        return <p>Učitavanje korisničkih podataka...</p>; // Prikaži poruku dok se podaci učitavaju
    }

    return (
        <div>
            <h2>Profil Korisnika</h2>
            {formData.profilePicture && (
                <div className="form-group">
                <label>Trenutna slika:</label>
                <img
                    src={process.env.REACT_APP_IMAGE_URL + formData.profilePicture} // Dodajte osnovni URL ispred relativne putanje
                    alt="Profilna slika"
                    style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                />
            </div>
            )}
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
