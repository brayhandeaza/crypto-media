import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

export const SocketContext = createContext()

const SocketProvider = ({ children }) => {
    // const [socket, setSocket] = useState(null)
    const [topsCoins, setTopsCoins] = useState([])
    const [bricaCoin, setBricaCoin] = useState({})
    const [prevBricaCoin, setPrevBricaCoin] = useState({})
    const [prevTopsCoins, setPrevTopsCoins] = useState({})
    const ethAddress = localStorage.getItem("ethAddress")

    // Coins socket
    useEffect(() => {
        const socket = io(process.env.REACT_APP_API_COINS_SERVER_URL)
        socket.emit("join-coins-server", { userId: ethAddress })

        socket.on("1hour-coin-changes", (coins) => {
            console.log("1hour-coin-changes: =>", coins);
        })

        socket.on("24hours-coin-changes", (coins) => {
            console.log("24hours-coin-changes: =>", coins);
        })

        socket.on("7days-coin-changes", (coins) => {
            console.log("7days-coin-changes: =>", coins);
        })

        socket.on("prev-tops-coins-limite-five", (coins) => {
            setPrevTopsCoins(coins)
        })

        socket.on("tops-coins-limite-five", (coins) => {
            setTopsCoins(coins)
        })

        socket.on("get-brica-coin", (coin) => {
            setBricaCoin(coin)
        })

        socket.on("get-prev-brica-coin", (coin) => {
            setPrevBricaCoin(coin)
        })
    }, [])

    return (
        <SocketContext.Provider value={{ topsCoins, prevTopsCoins, bricaCoin, prevBricaCoin }}>
            {children}
        </SocketContext.Provider >
    )
}


export default SocketProvider