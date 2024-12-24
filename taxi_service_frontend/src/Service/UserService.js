import axios from "axios";

const UserService = {

    profile : async (token, id) => {
        try {
            return await axios.get(process.env.REACT_APP_USER_URL + "user/profile?id="+id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch(error){
            throw error;
        }
    },

    updateProfile : async (token, updatedFormData) => {
        try {
            return await axios.put(process.env.REACT_APP_USER_URL + "user/update-profile", updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
            });
        } catch(error){
            throw error;
        }
    },

    getDrivers : async (token, id) => {
        try {
            return await axios.get(process.env.REACT_APP_USER_URL + "user/get-drivers?id="+id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }catch(error){
            throw error;
        }
    },

};

export default UserService;
