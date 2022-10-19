import React, { createContext, useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover } from 'antd'
import { MdArrowDropUp } from 'react-icons/md'
import Picker from 'emoji-picker-react'
import { faCamera, faCircleXmark, faFaceSmile } from '@fortawesome/free-solid-svg-icons'
import { ThemeContex } from './ThemeContext';
import Resizer from "react-image-file-resizer"
import { useSelector } from 'react-redux';
import $ from 'jquery';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner'

// import data from '@emoji-mart/data'
// import Picker from '@emoji-mart/react'

export const InputContext = createContext()

const InputProvider = ({ id, handleOnPost, from, commentId, wrap = 62, mw = 620, title = "Post" }) => {
    const { theme } = useContext(ThemeContex)
    const [showPost, setShowPost] = useState(false)
    const [wrapPostButton, setWrapPostButton] = useState(false)
    const [srcMedia, setSrcMedia] = useState("")
    const [hasMedia, setHasMedia] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [body, setBody] = useState("")
    const [file, setFile] = useState(null)
    const [focus, setFocus] = useState({
        offset: 0,
        node: null
    })

    const onInputChange = () => {
        const countNodes = document.getElementById(`searchchable-${id}`)
        const node = document.getSelection()

        setFocus({
            offset: node.focusOffset,
            node: node.focusNode
        })

        setShowPost(matchExpression(countNodes.textContent))
        setWrapPostButton(countNodes.childNodes.length > 1 || countNodes.textContent.length > wrap ? true : false)

        formatInput(id)

        if (matchExpression(countNodes.innerHTML)) {
            setBody(countNodes.innerHTML)
        }
    }

    const formatInput = (id) => {
        $(`#searchchable-${id}`).children().removeAttr("style")
        $(`#searchchable-${id} *`).children().removeAttr("style")

        $('code').replaceWith("<span>" + $('code').html() + "</span>")
    }

    const onClick = (e) => {
        const node = document.getSelection()
    }

    const onEmojiClick = (e, emojiObject) => {
        const searchchable = document.getElementById(`searchchable-${id}`)

        if (searchchable.innerHTML === "") {
            console.log(1);
            searchchable.innerHTML = `${emojiObject.emoji}`

            setFocus({
                offset: focus.offset + 1,
                node: searchchable
            })
        } else {
            const left = focus.node.textContent.slice(0, focus.offset)
            const right = focus.node.textContent.slice(focus.offset)
            const value = left + `${emojiObject.emoji}` + right
            const fValues = String(value).replace("\uD83D", "")

            focus.node.textContent = fValues

            // setFocus({

            // })

            console.log({
                offset: focus.offset,
                textContent: focus.node.textContent,
                value,
                left,
                right
            });
        }
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



        if (rgularExp.containsNumber.test(str) || rgularExp.contains_alphaNumeric.test(str) || rgularExp.containsAlphabet.test(str) || rgularExp.containsSymbol.test(str) || rgularExp.containsEmoji.test(str)) {
            return true
        }
        return false
    }

    const onPost = async () => {
        setIsLoading(true)
        handleOnPost({ commentId, body, file, hasMedia }).then(() => {
            setIsLoading(false)

            $(`#searchchable-${id}`).empty()

            setBody("")
            setShowPost(false)
            setWrapPostButton(false)
            setHasMedia(false)
        })

    }

    return (
        <InputContext.Provider value={{ showPost }}>
            <div className='col-12' style={{ maxWidth: mw }}>
                <section className='Input background mt-3' style={{ flexDirection: wrapPostButton ? "column" : "row", background: theme === "light" ? "#F1F3F5" : "#2C2E33" }}>
                    <div id={`searchchable-${id}`} placeholder="Post something..." onClick={onClick} onInput={onInputChange} contentEditable={true} className={`searchchable text col`}>

                    </div>
                    <div className={`post`}>
                        <Popover placement="bottom" trigger="click" content={
                            <div className={`${theme} p-content`}>
                                <div className='p-arrow-box'>
                                    <MdArrowDropUp color={theme === "light" ? "#A6A7AB" : "white"} className='p-arrow' style={{ fontSize: 50 }} />
                                </div>
                                <div style={{ width: 350, height: 350 }} className={`${theme}`}>
                                    {/* <Picker className="p-1" data={data} onEmojiSelect={console.log} /> */}
                                    <Picker native={true} className="p-1" onEmojiClick={(e, emojiObject) => onEmojiClick(e, emojiObject)} />
                                </div>
                            </div>
                        }>
                            <div style={{ height: 35, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ width: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <FontAwesomeIcon color={theme === "light" ? "#A6A7AB" : "white"} className='hover' style={{ fontSize: 17 }} icon={faFaceSmile} />
                                </span>
                            </div>
                        </Popover>
                        <div style={{ height: 35, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <label htmlFor={`cameraFile-${id}`} style={{ width: 30, marginTop: 2 }}>
                                <FontAwesomeIcon color={theme === "light" ? "#A6A7AB" : "white"} className='hover' style={{ fontSize: 18 }} icon={faCamera} />
                                <input onChange={(e) => handleMediaOnChange(e)} style={{ display: "none" }} type="file" name="" id={`cameraFile-${id}`} />
                            </label>
                        </div>
                        {showPost && <button onClick={onPost}>{title}</button>}
                    </div>
                </section>
                {hasMedia && <section className="Media" style={{ height: from === "reply" ? 300 : 400 }}>
                    {isLoading && <Spinner className='spiner-media' animation="border" />}
                    <div onClick={handleOnCloceMdua} className="close">
                        <FontAwesomeIcon color={"#909296"} className='hover icon' fontSize={30} icon={faCircleXmark} />
                    </div>
                    <div className="content" style={{ height: from === "reply" ? 300 : 400 }}>
                        <img src={srcMedia} alt="media-post" />
                    </div>
                </section>}
            </div >
        </InputContext.Provider>
    )
}


export default InputProvider