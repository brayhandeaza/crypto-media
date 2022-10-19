import axios from "axios"


export const getCurrentUser = async (payload) => {
    // const currentUser = await axios.get("users/f/f8p21L1GSbTz2qq7g0sBQNVCI")
    return {
        type: 'GET_CURRENT_USER',
        payload
    }
}