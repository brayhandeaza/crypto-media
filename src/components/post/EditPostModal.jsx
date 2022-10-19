import { faCircleArrowLeft, faCircleXmark, faEarthAmerica, faFaceSmile, faImage, faLock, faSortDown, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Picker from 'emoji-picker-react'
import Resizer from "react-image-file-resizer"
import { Modal, Popover } from 'antd'
import axios from 'axios'
import Cookies from 'universal-cookie'
import AuthContextLogin from "../../context/AuthLoging"
import { hideEdit } from '../../redux/slicers/modalSlice'

const EditPostModal = (props) => {
    const [hasVideo, setHasVideo] = useState(false)
    const [file, setFile] = useState(false)
    const [hasMedia, setHasMedia] = useState(false)
    const [open, setopen] = useState(false)
    const [showVisivility, setShowVisivility] = useState(false)
    const [showPostButton, setShowPostButton] = useState(false)
    const [value, setValue] = useState("")
    const [prevValue, setPrevValue] = useState("")
    const [src, setSrc] = useState("")
    const [privacy, setPrivacy] = useState("public")


    const fileRef = useRef()
    const cookies = new Cookies()
    const tokenCookie = cookies.get("ss_us_tnk")
    const { currentUser } = useContext(AuthContextLogin)
    const modal = useSelector(state => state.modalSlice)
    const dispatch = useDispatch()


    const onEmojiClick = (event, emoji) => {
        setValue(value + emoji.emoji)
        setShowVisivility(false)

        if (prevValue !== value + emoji.emoji) {
            setShowPostButton(matchExpression(value + emoji.emoji))
        } else {
            setShowPostButton(false)
        }
    }

    const handleOnChange = (e) => {
        setShowVisivility(false)
        setValue(e.target.value)

        const textArea = document.getElementById("textAreaEdit")
        textArea.style.height = 0

        if (textArea.scrollHeight < 250 && !hasMedia) {
            textArea.style.height = 250 + "px"
        } else {
            textArea.style.height = (textArea.scrollHeight + 10) + "px"
        }

        if (prevValue !== value) {
            setShowPostButton(matchExpression(e.target.value))
        } else {
            setShowPostButton(false)
        }
    }

    const matchExpression = (str) => {
        const rgularExp = {
            contains_alphaNumeric: /^(?!-)(?!.*-)[A-Za-z0-9-]+(?<!-)$/,
            containsNumber: /\d+/,
            containsAlphabet: /[a-zA-Z]/,
            containsSymbol: /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
            containsEmoji: /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u,
            onlyLetters: /^[A-Za-z]+$/,
            onlyNumbers: /^[0-9]+$/,
            onlyMixOfAlphaNumeric: /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/
        }

        const expMatch = {};
        expMatch.containsNumber = rgularExp.containsNumber.test(str);
        expMatch.containsAlphabet = rgularExp.containsAlphabet.test(str);
        expMatch.containsSymbol = rgularExp.containsSymbol.test(str);
        expMatch.containsEmoji = rgularExp.containsEmoji.test(str);
        expMatch.alphaNumeric = rgularExp.contains_alphaNumeric.test(str);

        expMatch.onlyNumbers = rgularExp.onlyNumbers.test(str);
        expMatch.onlyLetters = rgularExp.onlyLetters.test(str);
        expMatch.mixOfAlphaNumeric = rgularExp.onlyMixOfAlphaNumeric.test(str);

        if (rgularExp.containsNumber.test(str) || rgularExp.contains_alphaNumeric.test(str) || rgularExp.containsAlphabet.test(str) || rgularExp.containsSymbol.test(str) || rgularExp.containsEmoji.test(str)) return true
        return false
    }

    const handleOnSelect = (value) => {
        setPrivacy(value)
        setopen(!open)
        // alert(value)
    }

    const handleOnChangeFile = (e) => {
        if (e.target.files[0] && e.target.files[0].type.slice(0, 5) == "image") {
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
                            const output = document.getElementById('edit-output')
                            output.src = reader.result
                        }
                        reader.readAsDataURL(e.target.files[0])
                        setHasMedia(true)
                        setShowPostButton(true)
                        setShowVisivility(false)
                        setFile(e.target.files[0])

                        const textArea = document.getElementById("textAreaEdit")
                        textArea.style.height = 0
                        textArea.style.height = (textArea.scrollHeight) + "px"
                    },
                    "base64",
                    200,
                    200
                );
            } catch (err) {
                console.log(err)
            }
        } else {
            const reader = new FileReader()
            reader.onload = () => {
                const output = document.getElementById('video-output')
                output.src = reader.result
                setFile(reader.result)
            }
            reader.readAsDataURL(e.target.files[0])
            setHasMedia(false)
            setHasVideo(true)
            setShowVisivility(false)
        }
    }

    const handleOk = () => {
        dispatch(hideEdit())
    }

    const handleCancel = () => {
        dispatch(hideEdit())
        setPrevValue("")
        setValue("")
        setSrc("")
        setHasMedia(false)
        setShowPostButton(false)
    }

    const handleCloseImage = () => {
        setHasMedia(false)
        setShowVisivility(false)
        setSrc("")

        const textArea = document.getElementById("textAreaEdit")
        textArea.style.height = textArea.scrollHeight < 250 ? 250 : (textArea.scrollHeight + 10) + "px"
    }

    const handlePost = async () => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ugy6mqfd")

        if (hasMedia || hasVideo && src) {
            const _file = await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData)
            if (_file) {
                axios.patch(`posts/${modal.payload?.id}`, {
                    imageUrl: _file.data.url,
                    body: value === "" ? null : value.replace(/^\s+|\s+$/gm, ''),
                    privacy
                }).then(() => {
                })
            }
        } else {
            axios.patch(`posts/${modal.payload?.id}`, {
                imageUrl: null,
                body: value.replace(/^\s+|\s+$/gm, ''),
            }).then(() => {
            })
        }
        handleCancel()
    }

    const handleopenChange = (newopen) => {
        setopen(newopen)
    }

    useEffect(() => {
        setValue(modal.payload?.body)
        setPrevValue(modal.payload?.body)
        setPrivacy(modal.payload?.privacy)


        if (modal.edit) {
            setHasMedia(!modal.payload.imageUrl ? false : true)

            if (modal.payload.imageUrl) {
                setSrc(modal.payload.imageUrl)

                const lines = modal.payload.body.split(/\r|\r\n|\n/)
                const count = lines.length

                const textArea = document.getElementById("textAreaEdit")
                textArea.style.height = (count * 40) + "px"
            }
        }

    }, [modal.edit])


    return (
        <Modal width={500} closable={true} style={{ borderRadius: 15, zIndex: 1000000000 }} centeredtitle="" open={modal.edit} onOk={handleOk} onCancel={handleCancel}
            closeIcon={
                <div className="emoji-container-close-icon">
                    <FontAwesomeIcon className='hover emoji-close-icon ps-3'
                        icon={faCircleXmark} />
                </div>}
            footer={
                <div style={{ width: 500, height: 50, }}>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingRight: 20 }}>
                        <div style={{ display: "flex" }}>
                            <div style={{ display: "flex", alignItems: "center", margin: 20 }}>
                                <label htmlFor='file' className='hover' style={{ display: "flex", alignItems: "center" }} >
                                    <FontAwesomeIcon style={{ fontSize: 20, color: "#0073DD" }} icon={faImage} />
                                    <b className='ps-2'>Media</b>
                                </label>
                            </div>
                            <input ref={fileRef} onChange={handleOnChangeFile} accept="image/*,video/*" style={{ display: "none" }} type="file" id="file" />
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Popover trigger="click" content={
                                <div style={{ width: 350, height: 400 }}>
                                    <Picker className="p-1" onEmojiClick={(e, emojiObject) => onEmojiClick(e, emojiObject, modal.payload)} />
                                </div>
                            }>
                                <div style={{ height: 35, display: "flex", }}>
                                    <span style={{ width: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <FontAwesomeIcon className='hover' style={{ fontSize: 24, color: "rgba(000, 000, 000, 0.3)" }} icon={faFaceSmile} />
                                    </span>
                                </div>
                            </Popover>
                            {showPostButton ?
                                <div onClick={handlePost} className="live hover post-button" style={{ display: "flex", alignItems: "center" }}>
                                    <button className='hover'>Post</button>
                                </div>
                                :
                                <div className="live post-button" style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }} className='button-off'>Post</span>
                                </div>
                            }
                        </div>
                    </div>
                    {showVisivility && <Picker
                        groupNames={""}
                        disableSearchBar
                        onEmojiClick={onEmojiClick}
                        disableSkinTonePicker
                        disableAutoFocus
                    />}
                </div >
            }>
            <div id='edit-mo' className='col-1' style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "space-between" }}>
                <div className='ps-1 col-9' style={{ display: "flex" }}>
                    <img alt="crypto" className='col-3'
                        style={{ width: 42, height: 42, borderRadius: 100, imageResolution: "from-image" }}
                        src={modal.payload?.user.image}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <b className='ms-2 ps-3' style={{ color: "black", fontSize: 18 }}>{modal.payload?.user.firstName} {modal.payload?.user.lastName}</b>
                        <Popover onOpenChange={handleopenChange} open={open} className='ms-2 ps-3' placement='bottom' trigger={"click"} content={
                            <div style={{ width: 150 }}>
                                <div onClick={() => handleOnSelect("public")} className='pt-2 pb-2 hoverWithBG' style={{ display: "flex", alignItems: "center", paddingRight: 20, paddingLeft: 20 }}>
                                    <FontAwesomeIcon style={{ fontSize: 16, color: "rgba(000,000,000, 0.55)" }} icon={faEarthAmerica} />
                                    <span className='ms-2' style={{ fontSize: 16, textTransform: "capitalize" }}>Public</span>
                                </div>
                                <div onClick={() => handleOnSelect("private")} className='pt-2 pb-2 hoverWithBG' style={{ display: "flex", alignItems: "center", paddingRight: 20, paddingLeft: 20 }}>
                                    <FontAwesomeIcon style={{ fontSize: 16, color: "rgba(000,000,000, 0.55)" }} icon={faLock} />
                                    <span className='ms-2' style={{ fontSize: 16, textTransform: "capitalize" }}>Private</span>
                                </div>
                                <div onClick={() => handleOnSelect("friends")} className='pt-2 pb-2 hoverWithBG' style={{ display: "flex", alignItems: "center", paddingRight: 20, paddingLeft: 20 }}>
                                    <FontAwesomeIcon style={{ fontSize: 16, color: "rgba(000,000,000, 0.55)" }} icon={faUserGroup} />
                                    <span className='ms-2' style={{ fontSize: 16, textTransform: "capitalize" }}>Friends</span>
                                </div>
                            </div>
                        }>
                            <div className='hover' style={{ display: "flex", alignItems: "center" }}>
                                <FontAwesomeIcon style={{ fontSize: 16, color: "rgba(000,000,000, 0.55)" }} icon={privacy === "friends" ? faUserGroup : privacy === "private" ? faLock : faEarthAmerica} />
                                <span className='ms-2' style={{ fontSize: 16, textTransform: "capitalize" }}>{privacy}</span>
                                <FontAwesomeIcon className='ms-2 pb-1' style={{ fontSize: 14, color: "rgba(000,000,000, 0.55)" }} icon={faSortDown} />
                            </div>
                        </Popover>
                    </div>
                </div>
                <div className="to-scroll">
                    <div className="text" style={{ minHeight: 250, maxHeight: 500 }}  >
                        <textarea autoFocus id="textAreaEdit" onChange={handleOnChange} value={value} className='p-2' placeholder='Type something...'>
                        </textarea>
                        <div className='m-1'>
                            {hasMedia && <div onClick={handleCloseImage} className="close-img hover">
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </div>}
                            {hasMedia && <img src={src} alt='output' style={{ width: 450 }} id="edit-output" />}
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
        </Modal >
    )
}

export default EditPostModal

