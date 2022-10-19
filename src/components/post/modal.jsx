import React, { useContext, useRef, useState, useEffect } from 'react'
import { faCircleArrowLeft, faCircleXmark, faEarthAmerica, faImage, faLock, faMicrophone, faUserGroup, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect, useDispatch, useSelector } from 'react-redux'
import Resizer from "react-image-file-resizer"
import { Modal } from 'antd'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { hide } from '../../redux/slicers/modalSlice'
import { postFeed } from '../../redux/apiFetchs'
import Popover from '../Popover'
import { ThemeContex } from '../../contexts/ThemeContext'


const CreatePost = (props) => {
    const [hasVideo, setHasVideo] = useState(false)
    const [file, setFile] = useState(false)
    const [hasMedia, setHasMedia] = useState(false)
    const [open, setopen] = useState(false)
    const [showVisivility, setShowVisivility] = useState(false)
    const [value, setValue] = useState("")
    const [privacy, setPrivacy] = useState({
        value: 'public',
        label: 'Public',
        prefix: <FontAwesomeIcon fontSize={17} icon={faEarthAmerica} />
    })
    const [options] = useState([
        {
            value: 'public',
            label: 'Public',
            prefix: <FontAwesomeIcon fontSize={17} icon={faEarthAmerica} />
        },
        {
            value: 'private',
            label: 'Private',
            prefix: <FontAwesomeIcon fontSize={17} icon={faLock} />
        },
        {
            value: 'friends',
            label: 'Friends',
            prefix: <FontAwesomeIcon fontSize={17} icon={faUserGroup} />
        }
    ])

    const { theme } = useContext(ThemeContex)
    const fileRef = useRef()
    const cookies = new Cookies()
    const tokenCookie = cookies.get("ss_us_tnk")
    const [currentUser, setCurrentUser] = useState([])

    const modal = useSelector(state => state.modalSlice)
    const userSlice = useSelector(state => state.userSlice)
    const dispatch = useDispatch()
    const background = theme === "dark" ? "#141517" : "white"
    const color = theme === "dark" ? "white" : "#141517"

    const handleOnChange = (e) => {
        setShowVisivility(false)
        setValue(e.target.value)

        const textArea = document.getElementById("textArea")
        textArea.style.minHeight = 0
        textArea.style.minHeight = (textArea.scrollHeight) + "px"
    }

    const handleOnChangeFile = (e) => {
        if (e.target.files[0] && e.target.files[0].type.slice(0, 5) === "image") {
            try {
                Resizer.imageFileResizer(
                    e.target.files[0],
                    500,
                    300,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        const reader = new FileReader()
                        reader.onload = () => {
                            const output = document.getElementById('output')
                            output.src = reader.result
                        }
                        reader.readAsDataURL(e.target.files[0])
                        setHasMedia(true)
                        setShowVisivility(false)
                        setFile(e.target.files[0])

                        const textArea = document.getElementById("textArea")
                        textArea.style.height = 0
                        textArea.style.height = (textArea.scrollHeight) + "px"
                    },
                    "base64",
                    200,
                    200
                );
            } catch (err) {
                console.log(err);
            }
        } else {
            const reader = new FileReader()
            reader.onload = () => {
                const output = document.getElementById('video-output')
                output.src = reader.result
                setFile(reader.result)
            }
            reader.readAsDataURL(e.target.files[0])
            //  // setImageUrl(uri)
            setHasMedia(false)
            setHasVideo(true)
            setShowVisivility(false)
        }
    }

    const handleOk = () => {
        props.dispatch({ type: "HIDE_MODAL" })
    }

    const handleCancel = () => {
        dispatch(hide())
    }

    const handleCloseImage = () => {
        setHasMedia(false)
        setShowVisivility(false)

        const output = document.getElementById('output')
        const textArea = document.getElementById("textArea")
        output.src = ""
        textArea.style.height = 250 + "px"
    }

    const handlePost = async () => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ugy6mqfd")


        if (hasMedia || hasVideo) {
            const _file = await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData)
            if (_file) {
                dispatch(postFeed({
                    imageUrl: _file.data.url,
                    body: value === "" ? null : value,
                    privacy: privacy.value,
                    uuid: currentUser.uuid,
                    tokenCookie
                }))
            }
        } else {
            console.log({
                imageUrl: null,
                body: value,
                privacy: privacy.value,
                uuid: currentUser.uuid,
                tokenCookie
            })
            dispatch(postFeed({
                imageUrl: null,
                body: value,
                privacy: privacy.value,
                uuid: currentUser.uuid,
                tokenCookie
            }))
        }
    }

    const CloseIcon = () => {
        return (
            <div className="emoji-container-close-icon">
                <FontAwesomeIcon className='hover emoji-close-icon ps-3'
                    icon={faCircleXmark} />
            </div>
        )
    }

    const handleopenChange = (open) => {
        setopen(open)
    }

    const handleSelectedChange = (option) => {
        setopen(!open)
        setPrivacy(option)
        console.log(option);
    }

    const PopoverContent = () => {
        return (
            <div className='background' style={{ width: 200 }}>
                {options.map((option, key) => (
                    <div onClick={() => handleSelectedChange(option, key)} className={`ps-2 d-flex text align-items-center ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`} key={key} style={{ height: 50 }}>
                        {option.prefix}
                        <span className='text ps-2' style={{ fontSize: 18 }}>{option.label}</span>
                    </div>
                ))}
            </div>
        )
    }

    useEffect(() => {
        if (JSON.stringify(userSlice.user) !== "{}") {
            setCurrentUser(userSlice.user)
        }
    }, [userSlice])

    return (
        <Modal
            bodyStyle={{ background, borderRadius: 12 }}
            width={500}
            closable={showVisivility ? false : true}
            open={modal.show}
            onOk={handleOk}
            onCancel={handleCancel}
            closeIcon={CloseIcon}
            footer={null}
        >
            <div>
                <div className='col-1' style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "space-between" }}>
                    <div className='ps-1 col-9' style={{ display: "flex" }}>
                        <img alt="crypto" className='col-3'
                            style={{ width: 42, height: 42, borderRadius: 100, imageResolution: "from-image" }}
                            src={currentUser.image}
                        />
                        <div className='ms-3' style={{ display: "flex", flexDirection: "column" }}>
                            <b style={{ fontSize: 18, color }}>{currentUser.firstName} {currentUser.lastName}</b>
                            <Popover PopoverContent={PopoverContent} handleopenChange={handleopenChange} open={open}>
                                <div style={{ color }} className='hover'>
                                    {privacy.prefix}
                                    <span className='text ps-2' style={{ fontSize: 16 }}>{privacy.label}</span>
                                </div>
                            </Popover>
                        </div>
                    </div>
                    <div className="to-scroll">
                        <div className="text" style={{ minHeight: 250 }}  >
                            <textarea style={{ background, color, width: "100%", border: "none", fontSize: 22 }} autoFocus id="textArea" onChange={handleOnChange} value={value} className='p-2' placeholder='Type something...'>
                            </textarea>
                            <div>
                                {hasMedia && <div onClick={handleCloseImage} className="close-img hover">
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </div>}
                                {hasMedia && <img alt='output' style={{ width: 450 }} id="output" />}
                                {hasVideo && <video controls style={{ width: 450 }} id="video-output"></video>}
                            </div>
                        </div>
                    </div>
                    {showVisivility && <div className="emoji-container-close">
                        <FontAwesomeIcon
                            onClick={() => setShowVisivility(!showVisivility)}
                            className='hover emoji-close ps-3'
                            icon={faCircleArrowLeft} />
                    </div>}
                </div >
                <div style={{ width: 500, height: 50 }}>
                    <div style={{ display: "flex" }}>
                        <div style={{ display: "flex", alignItems: "center", margin: 20 }}>
                            <label htmlFor='file' className='hover text' style={{ display: "flex", alignItems: "center" }} >
                                <FontAwesomeIcon style={{ fontSize: 20, color: "#0073DD" }} icon={faImage} />
                                <b style={{ color }} className='ps-2'>Media</b>
                            </label>
                        </div>
                        <input ref={fileRef} onChange={handleOnChangeFile} accept="image/*,video/*" style={{ display: "none" }} type="file" id="file" />
                        <div className="live hover" style={{ display: "flex", alignItems: "center", margin: 20 }}>
                            <FontAwesomeIcon style={{ fontSize: 20, color: "#F0497C" }} icon={faVideo} />
                            <b style={{ color }} className='ps-2 text'>Go Live</b>
                        </div>
                        <div className="live hover" style={{ display: "flex", alignItems: "center", margin: 20 }}>
                            <FontAwesomeIcon style={{ fontSize: 20, color: "#7196B5" }} icon={faMicrophone} />
                            <b style={{ color }} className='ps-2'>Debate</b>
                        </div>

                        <div onClick={handlePost} className="live hover post-button" style={{ display: "flex", alignItems: "center", margin: 20 }}>
                            <button className='hover'>Post</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(CreatePost)

