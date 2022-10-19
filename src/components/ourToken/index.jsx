import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { BigNumber } from "bignumber.js"
import { ThemeContex } from '../../contexts/ThemeContext'
import { SocketContext } from '../../contexts/SocketContext'


const OurToken = (props) => {
    const { theme } = useContext(ThemeContex)
    const { bricaCoin, prevBricaCoin } = useContext(SocketContext)

    const formatPrice = (price) => {
        if (price > 1) return parseFloat(price).toFixed(2)

        if (price > 0.9) return parseFloat(price).toFixed(3)

        if (price > 0.09) return parseFloat(price).toFixed(4)

        if (price > 0.009) return parseFloat(price).toFixed(5)

        if (price > 0.0009) return parseFloat(price).toFixed(6)

        if (price > 0.0009) return parseFloat(price).toFixed(7)

        if (price > 0.000009) return parseFloat(price).toFixed(8)

        if (price > 0.0000009) return parseFloat(price).toFixed(9)

        if (price > 0.00000009) return parseFloat(price).toFixed(10)

        if (price > 0.000000009) return parseFloat(price).toFixed(11)

        if (price > 0.0000000009) return parseFloat(price).toFixed(12)

        if (price > 0.00000000009) return parseFloat(price).toFixed(13)

        if (price > 0.000000000009) return parseFloat(price).toFixed(14)

        if (price > 0.0000000000009) return parseFloat(price).toFixed(15)

        if (price > 0.00000000000009) return parseFloat(price).toFixed(16)

        if (price > 0.000000000000009) return parseFloat(price).toFixed(17)

        if (price > 0.0000000000000009) return parseFloat(price).toFixed(18)

        return "0.00"
    }

    useEffect(() => {
        if (prevBricaCoin?.symbol) {
            const coin = document.getElementById(`brica-coin`)
            coin.style.color = prevBricaCoin?.g ? "#4CAE4A" : "red"
            // console.log("prevBricaCoin: =>", prevBricaCoin);
        }

        setTimeout(() => {
            if (prevBricaCoin?.symbol) {
                const coin = document.getElementById(`brica-coin`)
                coin.style.color = theme === "light" ? "black" : "white"
            }
        }, 3000)
    }, [prevBricaCoin])

    return (
        <div className="OurToken mb-3 mt-3 col hover background">
            <div className="token-img col-3">
                <img style={{ borderRadius: "100%" }} src={bricaCoin?.imageUrl} alt="logo" />
            </div>
            <div className="col-9" style={{ display: "flex", flexDirection: "column" }}>
                <b className='font-weight-bold text' style={{ fontSize: 16 }}>{bricaCoin?.name} <span style={{ color: theme === "light" ? "rgba(000,000,000,0.5)" : "#ADB5BD", fontSize: 14 }}>({bricaCoin?.symbol})</span></b>
                <span id='brica-coin' style={{ color: theme === "light" ? "black" : "white" }} className='text'>{`$${formatPrice(bricaCoin?.price * bricaCoin?.quotePrice)}`}</span>
            </div>
        </div>
    )
}


export default OurToken