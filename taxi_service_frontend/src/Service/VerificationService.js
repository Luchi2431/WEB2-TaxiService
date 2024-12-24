import axios from "axios";

const VerificationService = {

    approve : async (token, id) => {
        try {
            await axios.put(process.env.REACT_APP_VERIFICATION_URL + "verification/approve?id="+id, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch(error){
            throw error;
        }
    },

    reject : async (token, id) => {
        try {
            await axios.put(process.env.REACT_APP_VERIFICATION_URL + "verification/reject?id="+id, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch(error){
            throw error;
        }
    },

};

export default VerificationService;
