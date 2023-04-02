import React, { useContext } from 'react'
import { FaBars } from "react-icons/fa"

import Logo from "../../assets/logo.png"
import Search from './Search'
import Menu from './Menu'
import Notification from './Notifications'
import { ThemeContex } from "../../contexts/ThemeContext"
import { MdDarkMode, MdLightMode } from 'react-icons/md'

const Header = () => {
    const { theme, setTheme } = useContext(ThemeContex)

    return (
        <div className={`${theme}`} style={{ width: "100%" }}>
            <div className={`background`}>
                <div className={`container`}>
                    <nav className="navbar navbar-expand-lg d-flex" style={{ alignItems: "center", height: 60 }}>
                        <div className="container-fluid">
                            <a className="navbar-brand" href="/">
                                <img style={{ width: 35, height: 35 }} src={Logo} alt="" srcSet="" />
                            </a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <FaBars fontSize={24} />
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <Search />
                                <Menu />
                                <div className="theme hover active ms-2">
                                    <Notification />
                                </div>
                                <div className={"hover theme"} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                                    {theme === "light" ?
                                        <MdLightMode color="#FCC419" fontSize={20} />
                                        :
                                        <MdDarkMode color="white" fontSize={18} />
                                    }
                                </div>
                            </div>
                        </div>
                    </nav >
                </div>
            </div >
        </div >
    )
}


export default Header
