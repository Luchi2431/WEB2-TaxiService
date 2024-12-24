import axios from "axios";
import Authentication from "../Contexts/Authentication";

const AuthenticationService = {

    login : async (email, password) => {
        try{
            return await axios.post(process.env.REACT_APP_AUTHENTICATION_URL + "authentication/login", JSON.stringify({ Email: email, Password: password }), {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        } catch(error){
            throw error;
        }
    },

    googleLogin : async (credential) => {
        try{
            return await axios.post(process.env.REACT_APP_AUTHENTICATION_URL + "authentication/google-login", JSON.stringify(credential), {
                headers: {
                    'Content-Type': 'application/json', // Uveri se da postavljaš ispravan Content-Type
                },
            });
        } catch(error){
            throw error;
        }
    },

    register : async (formDataToSend) => {
        try{
            return axios.post(process.env.REACT_APP_AUTHENTICATION_URL + "authentication/register", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Uveri se da postavljaš ispravan Content-Type
                },
            });
        } catch(error){
            throw error;
        }
    },

    googleRegister : async (credential, selectedOption) => {
        try{
            return await await axios.post(process.env.REACT_APP_AUTHENTICATION_URL + "authentication/google-register", JSON.stringify({googleToken:credential, userType : selectedOption}),{
                headers: {
                    'Content-Type': 'application/json', // Uveri se da postavljaš ispravan Content-Type
                },
            });
        } catch(error){
            throw error;
        }
    },

};

export default AuthenticationService;
