import React, { useEffect, useState } from 'react';
import Logo from "../assets/logo.png"
import Calendar from 'react-calendar'
import Popover from '../components/Popover';
import moment from "moment"
import { useDispatch } from 'react-redux';
import { posthUsers } from '../redux/apiFetchs';

const UserInfo = () => {
    const ethAddress = localStorage.getItem("ethAddress")
    const [value, onChange] = useState(new Date())
    const [open, setopen] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const [date, setDate] = useState(moment().subtract(15, "years").format("LL"))

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const dispatch = useDispatch()


    const logOut = async () => {
        window.location.reload()
    }

    const handleopenChange = (newopen) => {
        setopen(newopen)
    }

    const handleOnClickDay = (date) => {
        onChange(date)
        setDate(date)
        setopen(false)
    }


    const handleInputChange = (e, name) => {
        switch (name) {
            case "firstName":
                setFirstName(e.target.value)
                break;
            case "lastName":
                setLastName(e.target.value)
                break;
            case "username":
                setUsername(e.target.value)
                break;
            default:
                break;
        }
    }

    const handleOnClick = () => {
        const image = "https://res.cloudinary.com/dbsswqtg9/image/upload/v1658696730/images/images_cig2yx.png"
        dispatch(posthUsers({
            firstName,
            lastName,
            username,
            uuid: ethAddress,
            image,
            dob: `${date}`
        }))
        // console.log({ firstName, lastName, username, uuid, image, date: `${date}` })
    }


    const PopoverContent = () => {
        return (
            <div className='background' style={{ width: 300 }}>
                <Calendar onChange={onChange} onClickDay={handleOnClickDay} maxDate={new Date(moment().subtract(15, "years"))} value={value} />
            </div>
        )
    }

    useEffect(() => {
        if (firstName === "" || lastName === "" || username === "") {
            setIsDisabled(true)
        } else {
            setIsDisabled(false)
        }
    }, [firstName, lastName, username])


    return (
        <div className="UserInfo">
            <div style={{ height: "100vh" }}>
                <div className={`background `} style={{ width: "100%", position: "absolute" }}>
                    <div>
                        <div className={`container`}>
                            <nav className="navbar navbar-expand-lg d-flex" style={{ alignItems: "center", height: 60 }}>
                                <div className="container-fluid">
                                    <img style={{ width: 35, height: 35 }} src={Logo} alt="" srcSet="" />
                                    <button className='button' onClick={logOut}>Logout</button>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className='row content'>
                    <div style={{ height: "70%" }} className='col-5'>
                        hbhj
                    </div>
                    <div style={{ height: "70%" }} className='col-5'>
                        <div className="info" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div >
                                <h2 className='ps-2'>About you</h2>
                                <p className='ps-2'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. <br />consequuntur possimus commodi.</p>
                                <div className="mb-3" style={{ display: "flex" }}>
                                    <input onChange={(e) => handleInputChange(e, "firstName")} type="email" className="m-1 col" id="exampleFormControlInput1" placeholder="First Name" />
                                    <input onChange={(e) => handleInputChange(e, "lastName")} type="email" className="m-1 col" id="exampleFormControlInput1" placeholder="Last Name" />
                                </div>
                                <div className="mb-3" style={{ display: "flex" }}>
                                    <input onChange={(e) => handleInputChange(e, "username")} type="text" className="m-1 col" name="username" placeholder="Username" />
                                    <div className='col-6'>
                                        <Popover PopoverContent={PopoverContent} handleopenChange={handleopenChange} open={open}>
                                            <div className="mb-3" style={{ display: "flex" }}>
                                                <input value={moment(date).format("LL")} type="text" disabled className="m-1 col" name="username" placeholder="Username" />
                                            </div>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end" }} >
                                <input onClick={handleOnClick} disabled={isDisabled} style={{ opacity: isDisabled ? 0.4 : 1 }} type="submit" value="Continue" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfo
