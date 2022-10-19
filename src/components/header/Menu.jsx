import React, { useContext, useEffect, useState } from 'react'
import Popover from '../Popover'
import { ThemeContex } from '../../contexts/ThemeContext'
import Dots from './Dots'
import { useSelector } from 'react-redux'
import { MdSettings, MdSupport, MdLogout } from 'react-icons/md'



const Menu = () => {
    const [open, setopen] = useState(false)
    const [user, setUser] = useState({})
    const { theme } = useContext(ThemeContex)
    const { userSlice } = useSelector(state => state)
    const [items] = useState([
        { icon: <MdSettings className='text' style={{ fontSize: 20 }} />, title: "Settings" },
        { icon: <MdSupport className='text' style={{ fontSize: 20 }} />, title: "Support" },
        { icon: <MdLogout className='text' style={{ fontSize: 20 }} />, title: "Logout" }
    ])



    const handleRediretion = (path) => {
        window.location.href = path
    }

    const logOut = async () => {
        localStorage.clear()
        window.location.reload()
    }

    useEffect(() => {
        if (JSON.stringify(userSlice.user) !== "{}") {
            setUser(userSlice.user)
        }
    }, [userSlice])

    const PopoverContent = () => {
        return (
            <div className='p-body'>
                <div>
                    <div onClick={() => handleRediretion(`/u/${user.username}`)} className={`col-12 d-flex first align-items-center p-3 ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`} style={{ height: 100, padding: 0 }}>
                        <img alt="crypto" style={{ width: 45, height: 45, borderRadius: 100, }}
                            src={user.image} />
                        <div className="col d-flex flex-column justify-conten-center">
                            <span className="text title h6 ps-3 fw-bold">{user.firstName} {user.lastName}</span>
                            <span className="text profile ps-3">My Profile</span>
                        </div>
                    </div>

                    {items.map((item, key) => (
                        <div onClick={key !== 2 ? () => handleRediretion(`/${item.title.toLowerCase()}`) : () => logOut()} key={key} style={{ height: 60 }}
                            className={`col-12 ${key === items.length - 1 && "last"}  ${key === 2 ? "" : "mb-2"} d-flex align-items-center ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                            <div style={{ paddingLeft: 25 }} className="col-2 justify-conten-center align-items-center">
                                {item.icon}
                            </div>
                            <div className="col-10">
                                <span className="text ps-3">{item.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const handleopenChange = () => {
        setopen(!open)
    }

    return (
        <div className='Menu'>
            <div className="btn" onClick={() => setopen(!open)}>
                <Popover
                    children={<Dots color="#A6A7AB" />}
                    PopoverContent={PopoverContent}
                    handleopenChange={handleopenChange}
                    open={open} />
            </div>
        </div>
    )
}


export default Menu