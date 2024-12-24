import axios from "axios";

const RideService = {

    allRides : async (token) => {
        try{
            return await axios.get(process.env.REACT_APP_RIDE_URL + "ride/all-rides", {
                headers: {
                  Authorization: `Bearer ${token}`
                },
              });
        } catch(error){
            throw error;
        }
    },

    myRides : async (token, id) => {
        try{
            return await axios.get(process.env.REACT_APP_RIDE_URL + "ride/my-rides?id="+id, {
                headers: {
                  Authorization: `Bearer ${token}`
                },
              });
        } catch(error){
            throw error;
        }
    },

    estimate : async (token, startAddress, endAddress) => {
        try{
            return await axios.post(process.env.REACT_APP_RIDE_URL + "ride/estimate", { startAddress, endAddress }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
        }catch(error){
            throw error;
        }
    },

    confirm : async (token, formData) => {
        try{
            await axios.post(process.env.REACT_APP_RIDE_URL + "ride/confirm", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Uveri se da postavljaš ispravan Content-Type
                    Authorization: `Bearer ${token}`
                },
            });
        } catch(error){
            throw error;
        }
    },

    newRides : async (token) => {
        try {
            return await axios.get(process.env.REACT_APP_RIDE_URL + "ride/new-rides", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch(error){
            throw error;
        }
    },

    rideAccept : async (token, rideId, id) => {
        try {
            return await axios.post(process.env.REACT_APP_RIDE_URL + "ride/accept", JSON.stringify({ rideId : rideId , driverId : id }), { // API za prihvatanje vožnje
                headers: {
                    'Content-Type': 'application/json', // Uveri se da postavljaš ispravan Content-Type
                    Authorization: `Bearer ${token}`
                },
            });
        } catch(error){
            throw error;
        }
    },

    previousRides : async (token, id) => {
        try {
            return await axios.get(process.env.REACT_APP_RIDE_URL + "ride/previous-rides?id="+id, {
                headers: {
                  Authorization: `Bearer ${token}`
                },
              });
        } catch(error){
            throw error;
        }
    },

};

export default RideService;
