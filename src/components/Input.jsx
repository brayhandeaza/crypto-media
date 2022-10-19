import React, { useContext, useState } from 'react';
import { Popover } from 'antd'
import { MdArrowDropUp, MdCamera, MdCancel, MdSentimentSatisfied } from 'react-icons/md'
import Picker from 'emoji-picker-react'
import { ThemeContex } from '../contexts/ThemeContext';
import Resizer from "react-image-file-resizer"
import { useSelector } from 'react-redux';
import $ from 'jquery';
import axios from 'axios';


const Input = ({ post, setLimit, limit, fetchComments }) => {
    const { theme } = useContext(ThemeContex)
    const [childNodes, setChildNodes] = useState("")
    const [showPost, setShowPost] = useState(false)
    const [srcMedia, setSrcMedia] = useState("")
    const [hasMedia, setHasMedia] = useState(false)
    const [body, setBody] = useState("")
    const [file, setFile] = useState(null)
    const { userSlice } = useSelector(state => state)

    const onInputChange = (e) => {
        const countNodes = document.getElementById(`searchchable-${post.uuid}`)
        setChildNodes(countNodes.childNodes.length)
        setBody(countNodes.innerHTML)

        matchExpression(countNodes.textContent)
        setShowPost(matchExpression(countNodes.textContent))
    }

    const onClick = (e) => {
        // const countNodes = document.querySelector(".searchchable")
        // const node = document.getSelection()
    }


    const onEmojiClick = (e, emojiObject) => {

    }

    const handleMediaOnChange = (e) => {
        if (e.target.files[0]) {
            try {
                Resizer.imageFileResizer(e.target.files[0], 400, 400, "JPEG", 100, 0, (uri) => {
                    setHasMedia(true)
                    setSrcMedia(uri)
                    setFile(uri)
                },
                    "base64",
                    4200,
                    400
                )
                setShowPost(true)
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleOnCloceMdua = () => {
        setSrcMedia("")
        setHasMedia(false)
        setShowPost(false)
    }

    const matchExpression = (str) => {
        const rgularExp = {
            contains_alphaNumeric: /^(?!-)(?!.*-)[A-Za-z0-9-]+(?<!-)$/,
            containsNumber: /\d+/,
            containsAlphabet: /[a-zA-Z]/,
            containsSymbol: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
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

        console.log(expMatch)

        if (rgularExp.containsNumber.test(str) || rgularExp.contains_alphaNumeric.test(str) || rgularExp.containsAlphabet.test(str) || rgularExp.containsSymbol.test(str) || rgularExp.containsEmoji.test(str)) {
            return true
        }
        return false
    }

    const handleOnPost = async () => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ugy6mqfd")

        if (hasMedia) {
            console.log(userSlice.user.id)
            const file = await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData)
            if (file) {
                await axios.post("comments", {
                    postId: post.id,
                    userId: userSlice.user.id,
                    body: body === "" ? null : body,
                    imageUrl: file.data.url,
                    parentId: null
                }).then(() => {
                    setBody("")
                    setShowPost("")
                    setHasMedia(false)


                    $(`#input-from-post-${post.id}`).val("")
                    $(`#toggle-comment-from-${post.id}`).show()
                    $(`#button-post-${post.uuid}`).hide()
                    $(`#searchchable-${post.uuid}`).empty()

                    fetchComments(limit)
                    setLimit(3)
                })
            }
        } else {
            await axios.post("comments", {
                postId: post.id,
                userId: userSlice.user.id,
                body,
                imageUrl: null,
                parentId: null
            }).then((res) => {
                setBody("")
                setShowPost("")
                setHasMedia(false)


                $(`#input-from-post-${post.id}`).val("")
                $(`#toggle-comment-from-${post.id}`).show()
                $(`#button-post-${post.id}`).hide()
                $(`#searchchable-${post.uuid}`).empty()
                fetchComments(limit)
            })
        }
    }

    return (
        <div>
            <section className='Input background mt-3' style={{ flexDirection: childNodes > 1 ? "column" : "row", background: theme === "light" ? "#F1F3F5" : "#2C2E33" }}>
                <div id={`searchchable-${post.uuid}`} placeholder="Post something..." onClick={onClick} onInput={onInputChange} contentEditable={true} className={`searchchable text col`}>

                </div>
                <div className={`post`}>
                    <Popover placement="bottom" trigger="click" content={
                        <div className={`${theme} p-content`}>
                            <div className='p-arrow-box'>
                                <MdArrowDropUp color={theme === "light" ? "#A6A7AB" : "white"} className='p-arrow' style={{ fontSize: 50 }} />
                            </div>
                            <div style={{ width: 350, height: 350 }} className={`${theme}`}>
                                <Picker disableSkinTonePicker={true} className="p-1" onEmojiClick={(e, emojiObject) => onEmojiClick(e, emojiObject)} />
                            </div>
                        </div>
                    }>
                        <div style={{ height: 35, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ width: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <MdSentimentSatisfied color={theme === "light" ? "#A6A7AB" : "white"} className='hover' style={{ fontSize: 17 }} />
                            </span>
                        </div>
                    </Popover>
                    <div style={{ height: 35, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <label htmlFor="cameraFile" style={{ width: 30, marginTop: 2 }}>
                            <MdCamera color={theme === "light" ? "#A6A7AB" : "white"} className='hover' style={{ fontSize: 18 }} />
                            <input onChange={(e) => handleMediaOnChange(e)} style={{ display: "none" }} type="file" name="" id="cameraFile" />
                        </label>
                    </div>
                    {showPost && <button onClick={handleOnPost}>Post</button>}
                </div>
            </section>
            {hasMedia && <section className="Media">
                <div onClick={handleOnCloceMdua} className="close">
                    <MdCancel color={"#909296"} className='hover icon' fontSize={30} />
                </div>
                <div className="content">
                    <img src={srcMedia} alt="media-post" />
                </div>
            </section>}
        </div >
    );
}

export default Input;
