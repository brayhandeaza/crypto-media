import axios from "axios";

export const Adult = axios.create({
    baseURL: "https://adultvideosapi.com",
    
    headers: {
        "X-API-Key": "MhOp0FRIjTRd6jED2t0h6QBRFI5BB72E",
        Accept: "application/json"
    },
})