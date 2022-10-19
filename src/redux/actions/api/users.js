import axios from "axios"


export const getOne = (address) => {
    // const user = await axios.get(`users/f/${address}`)
    // console.log(user.data);
    return {
        type: 'GET_ONE_USER',
        payload: "user"
    }
}