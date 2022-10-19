import React, { useContext, useState } from 'react'
import AuthContext from '../contexts/AuthContext';


const SignUpScreen = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const [wallet, setWallet] = useState("")



    const login = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
                setWallet("connected")
                localStorage.setItem("ethAddress", accounts[0])
                setIsAuthenticated(true)
                // window.location.reload()
            }).catch((error) => {
                console.log(error);
            })
        } else {
            setWallet("no connected")
        }
    }

    return (
        <div className="SignUp" style={{ background: "white", height: "100vh" }}>
            <button onClick={login}>Connect to Metamask</button>
        </div>
    )
}

export default SignUpScreen