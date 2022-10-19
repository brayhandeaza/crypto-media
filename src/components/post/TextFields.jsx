import React, { useContext, useRef, useState } from 'react'
import { faCamera, faCircleXmark, faFaceSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import $ from "jquery"
import AuthContext from '../../contexts/AuthContext'
import Resizer from "react-image-file-resizer"
import { Popover } from 'antd'
import Picker from 'emoji-picker-react'
import { MdArrowDropUp } from 'react-icons/md'
import { ThemeContex } from '../../contexts/ThemeContext'
import { useDispatch, useSelector } from 'react-redux'

const TextFields = ({ post, fetchComments, limit, setLimit }) => {
    const [reply, setReply] = useState(false)
    const [showTags, setShowTags] = useState(false)
    const [isUser, setIsUser] = useState(true)
    const [replyBody, setReplyBody] = useState("")
    const [comments, setComments] = useState([])
    const [hasMedia, setHasMedia] = useState(false)
    const [hasMediaReply, setHasMediaReply] = useState(false)
    const [count, setCount] = useState("")
    const [body, setBody] = useState("")
    const [lastTag, setLastTag] = useState("")
    const [srcMedia, setSrcMedia] = useState("")
    const [file, setFile] = useState(null)
    const [inputHeight, setInputHeight] = useState(35)
    const [datas, setDatas] = useState({})
    const [cryptoTagData, setCryptoTagData] = useState([])
    const [userTagData, setUserTagData] = useState([])
    const { theme } = useContext(ThemeContex)
    const imageRef = useRef()
    const { userSlice } = useSelector(state => state)

    const handleTagOnclick = (tag, postId, type) => {
        const node = `<b><a class="tags" href="${window.location.host}/u/${tag.username}">${tag.firstName} ${tag.lastName}</a></b>`

        $(`#input-from-post-${postId}`).append(node)
        $(`#input-from-post-${postId}`).append("&nbsp;")
        $(`#input-from-post-${postId}`).html().replace('"@bra"', "")

        setShowTags(false)
    }

    const handleOnChange = (e, id) => {
        setBody(e.target.value)

        if (matchExpression(e.target.value) || hasMedia) {
            $(`#button-post-${id}`).show()
        } else {
            $(`#button-post-${id}`).hide()
        }

        const textArea = document.getElementById(`input-from-post-${post.id}`)
        textArea.style.minHeight = 0
        textArea.style.minHeight = (textArea.scrollHeight) + "px"

        setInputHeight(0)
        setInputHeight(textArea.scrollHeight)
        handleOnInput(e)
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

    const handleOnInput = (e) => {
        const tags = e.target.innerHTML.split(" ")
        if (tags[tags.length - 1][0] === "@" || tags[tags.length - 1][0] === "$") {
            setShowTags(true)
            setLastTag(tags[tags.length - 1])
            fetchByTags(tags[tags.length - 1].slice(1), tags[tags.length - 1][0])
        } else {
            setShowTags(false)
        }
    }


    const fetchByTags = async (search, type) => {
        const user = axios.get(`users/search?search=${search.toLowerCase()}`, { headers: { type: "users" } })
        const crypto = axios.get(`coins/search?search=${search}`, { headers: { type: "crypto" } })

        let keys = []
        let result = {}

        if (type === "@") {
            Promise.all([user]).then((res) => {
                res.forEach(promise => {
                    result[promise.data.search] = promise.data.data
                    keys.push(promise.data.search)
                })
                setUserTagData(result.users)
                setIsUser(true)
            })
        } else if (type === "$") {
            Promise.all([crypto]).then((res) => {
                res.forEach(promise => {
                    result[promise.data.search] = promise.data.data
                    keys.push(promise.data.search)
                })
                setCryptoTagData(result.crypto)
                setIsUser(false)
            })
        }
    }

    const onEmojiClick = (e, emojiObject, id) => {
        setBody(body + emojiObject.emoji)

        if (body.length >= 0 || hasMedia) {
            $(`#button-post-${id}`).show()
        } else {
            $(`#button-post-${id}`).hide()
        }
    }

    const handleMediaOnChange = (e, id) => {
        if (e.target.files[0]) {
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
                            setHasMedia(true)
                            setFile(e.target.files[0])
                            setSrcMedia(reader.result)

                            $(`#button-post-${id}`).show()
                        }
                        reader.readAsDataURL(e.target.files[0])
                    },
                    "base64",
                    200,
                    200
                )
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleOnPost = async (postId) => {
        console.log(userSlice.user.id)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ugy6mqfd")

        if (hasMedia) {
            console.log(userSlice.user.id)
            const file = await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData)
            if (file) {
                await axios.post("comments", {
                    postId,
                    userId: userSlice.user.id,
                    body: body === "" ? null : body,
                    imageUrl: file.data.url,
                    parentId: null
                }).then((res) => {
                    setBody("")
                    setHasMedia(false)

                    $(`#input-from-post-${postId}`).val("")
                    $(`#toggle-comment-from-${postId}`).show()
                    $(`#button-post-${postId}`).hide()

                    fetchComments(limit)
                    // setLimit(3)
                })
            }
        } else {
            await axios.post("comments", {
                postId,
                userId: userSlice.user.id,
                body,
                imageUrl: null,
                parentId: null
            }).then((res) => {
                setBody("")
                setHasMedia(false)

                $(`#input-from-post-${postId}`).val("")
                $(`#toggle-comment-from-${postId}`).show()
                $(`#button-post-${postId}`).hide()

                fetchComments(limit)
            })
        }
    }

    const handleCloseImage = (id) => {
        setHasMedia(false)
        setFile(null)
        $(`#output-comment-media`).hide()
        $(`#button-post-${id}`).hide()
    }




    return (
        <div className='cmt text' id={`comment-post-${post.id}`}>
            <div style={{ height: inputHeight, display: "flex", alignItems: inputHeight > 40 ? "flex-end" : "center" }} className="comment-post-container mt-3">
                <Popover placement="bottom" open={showTags} trigger="click" content={
                    <div className={`${theme} p-content`}>
                        <div className='p-arrow-box'>
                            <MdArrowDropUp className='p-arrow' style={{ fontSize: 50 }} color={theme === "dark" ? "#1A1B1E" : "white"} />
                        </div>
                        <div style={{ width: 350, borderWidth: 1 }} className="background p-bg">
                            {isUser ?
                                userTagData.map((user, key) => (
                                    <div onClick={() => handleTagOnclick(user, post.id, "u")} key={key} style={{ height: 60 }} className={`col-12 ${key === userTagData.length - 1 ? "" : "mb-2"} d-flex align-items-center ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                        <div style={{ paddingLeft: 25 }} className="col-2 justify-conten-center align-items-center">
                                            <img alt="crypto" style={{ width: 30, height: 30, borderRadius: 100, imageResolution: "from-image" }} src={user.image} />
                                        </div>
                                        <div className="col-10 d-flex" style={{ justifyContent: "space-between" }}>
                                            <span className="ps-3 title text">{user.firstName} {user.lastName}</span>
                                        </div>
                                    </div>
                                )) :
                                cryptoTagData.map((coin, key) => (
                                    <div onClick={() => handleTagOnclick(coin, post.id, "c")} key={key} style={{ height: 60 }} className={`col-12 ${key === cryptoTagData.length - 1 ? "" : "mb-2"} d-flex align-items-center ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                        <div style={{ paddingLeft: 25 }} className="col-2 justify-conten-center align-items-center">
                                            <img alt="crypto" style={{ width: 30, height: 30, borderRadius: 100, imageResolution: "from-image" }} src={coin.imageUrl} />
                                        </div>
                                        <div className="col-10 d-flex" style={{ justifyContent: "space-between" }}>
                                            <span className="ps-3 title">{coin.name} ({coin.symbol})</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }>
                    <textarea autoComplete="off" style={{ height: 30 }} id={`input-from-post-${post.id}`} value={body} onChange={(e) => handleOnChange(e, post.id)} className="form-control ms-1 textAreaColor" type="text" placeholder="Type a comment" aria-label="Post something">
                    </textarea>
                </Popover>
                <Popover placement="bottom" trigger="click" content={
                    <div className={`${theme} p-content`} style={{ borderColor: theme === "dark" ? "rgb(37, 38, 43)" : "white" }}>
                        <div className='p-arrow-box'>
                            <MdArrowDropUp className='p-arrow' style={{ fontSize: 50 }} color={theme === "dark" ? "#1A1B1E" : "white"} />
                        </div>
                        <div style={{ width: 350, height: 350 }} className={`${theme}`}>
                            <Picker disableSkinTonePicker={true} native className="p-1" onEmojiClick={(e, emojiObject) => onEmojiClick(e, emojiObject, post.id)} />
                        </div>
                    </div>
                }>

                    <div style={{ height: 35, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ width: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FontAwesomeIcon className='hover text' style={{ fontSize: 17 }} icon={faFaceSmile} />
                        </span>
                    </div>

                </Popover>
                <div style={{ height: 35, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <label htmlFor="cameraFile" style={{ width: 40, marginTop: 2 }}>
                        <FontAwesomeIcon className='hover text' style={{ fontSize: 18 }} icon={faCamera} />
                        <input onChange={(e) => handleMediaOnChange(e, post.id)} style={{ display: "none" }} type="file" name="" id="cameraFile" />
                    </label>
                </div>
                <button id={`button-post-${post.id}`} style={{ display: "none" }} onClick={() => handleOnPost(post.id)} className={`${inputHeight > 40 && "mb-1"} hover comment-post`}>Post</button>
            </div>
            {hasMedia &&
                <div className='mt-2 p-2' style={{ borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <img ref={imageRef} alt='output' id='output-comment-media' src={srcMedia} style={{ width: 150, borderRadius: 10 }} />
                    </div>
                    <div onClick={() => handleCloseImage(post.id)} style={{ display: "flex", justifyContent: "center" }} className="close-img pt-1 hover col-1">
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </div>
                </div>
            }
        </div>
    );
}

export default TextFields;
