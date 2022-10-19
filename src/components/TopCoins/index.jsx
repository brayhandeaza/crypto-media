import React, { useContext, useEffect } from 'react'
import { Link } from "react-router-dom";
import { SocketContext } from '../../contexts/SocketContext';
import { ThemeContex } from '../../contexts/ThemeContext';


const TopsCoins = () => {
    const { theme } = useContext(ThemeContex)
    const { topsCoins, prevTopsCoins } = useContext(SocketContext)
    const handleRediretion = (path) => {
        window.location.href = path
    }

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
    }

    const formatName = (name) => {
        if (name.length < 15) return name
        return name.slice(0, 14) + " ..."
    }

    useEffect(() => {
        if (prevTopsCoins?.symbol) {
            const coin = document.getElementById(`five-tops-coins-${prevTopsCoins.symbol}`)
            coin.style.color = prevTopsCoins?.g ? "#4CAE4A" : "red"
            // console.log("prevTopsCoins: =>", prevTopsCoins);
        }

        setTimeout(() => {
            if (prevTopsCoins?.symbol) {
                const coin = document.getElementById(`five-tops-coins-${prevTopsCoins.symbol}`)
                coin.style.color = theme === "light" ? "black" : "white"
            }
        }, 3000)
    }, [prevTopsCoins, theme])

    return (
        <section className="TopCoins mt-3 mb-3 background">
            <div className="title mb-3 mt-2 ms-2" style={{ fontSize: 18, height: 30 }}>
                <b className='font-weight-bold text' style={{ fontSize: 20 }}>Top Coins</b>
            </div>
            <div className="coin-container mt-4">
                {topsCoins.map((coin, key) => (
                    <div key={key} onClick={() => handleRediretion(`/c/${coin?.symbol}`)} className={`coin ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`} style={{ height: 60 }}>
                        <div className="token-img col-3">
                            <img src={coin?.imageUrl} alt="logo" />
                        </div>
                        <div className="token-img col-9">
                            <b className='font-weight-bold text' style={{ fontSize: 16, textOverflow: "ellipsis" }}>{formatName(coin?.name)}
                                <span style={{ color: theme === "light" ? "rgba(000,000,000,0.5)" : "#ADB5BD", }}> ({coin?.symbol})</span>
                            </b>
                            <div>
                                <span style={{ color: theme === "light" ? "black" : "white" }} id={`five-tops-coins-${coin?.symbol}`} className='five-tops-coins'>
                                    ${formatPrice(coin?.price * coin?.quotePrice)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="more mt-1 p-3" style={{ paddingLeft: 5 }}>
                <Link to="/c/top-coins">View more</Link>
            </div>
        </section>
    )
}

export default TopsCoins