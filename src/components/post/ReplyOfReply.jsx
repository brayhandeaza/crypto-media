import React, { useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { faEllipsis, faHeart, faShare, faCamera, faCircleXmark, faComment, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import $ from "jquery"
import { Link } from 'react-router-dom'
import Resizer from "react-image-file-resizer"
import { ThemeContex } from '../../contexts/ThemeContext'
import { Popover } from 'antd'
import { MdArrowDropUp } from 'react-icons/md'
import InputProvider from '../../contexts/InputContext'

const ReplyOfReply = ({ reply, fetchComments, limit, commentCount }) => {
    const [repliesOfReply, setRepliesOfReply] = useState([])
    const { userSlice } = useSelector(state => state)
    const [hasMediaReply, setHasMediaReply] = useState(false)
    const [count, setCount] = useState("")
    const [showPost, setShowPost] = useState(false)
    const [showViewMore, setShowViewMore] = useState(false)
    const [replyLimit, setReplyLimit] = useState(1)

    const { theme } = useContext(ThemeContex)


    const handleOnDelete = async (id) => {
        await axios.delete(`reply/${id}`, { hidden: true }).then((res) => {
            fetchReply(replyLimit)
            fetchComments(limit)


        }).catch((err) => {
            console.error("error:", err)
        })
    }

    const handlePostReply = async ({ commentId, body, hasMedia, file }) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ugy6mqfd")

        if (hasMedia) {
            const _file = await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData)
            if (_file) {
                await axios.post("/reply", {
                    commentId,
                    userId: userSlice.user.id,
                    body,
                    imageUrl: _file.data.url,
                }).then(() => {

                    $(`#searchchable-${commentId}`).empty()

                    fetchReply(replyLimit)
                    setShowPost(false)
                    $(`#input-reply-${commentId}`).toggle()
                    fetchComments(limit)
                })
            }
        } else {
            await axios.post("/reply", {
                commentId,
                userId: userSlice.user.id,
                body,
                imageUrl: null
            }).then(() => {
                $(`#searchchable-${commentId}`).empty()
                fetchReply(replyLimit)
                setShowPost(false)
                fetchComments(limit)
                $(`#input-reply-${commentId}`).toggle()
            })
        }
    }



    const onShowImageModal = (imageUrl) => {
        // // props.dispatch({ type: "SHOW_IMAGE_MODAL", payload: imageUrl })
        // dispatch(showCommentMedia(imageUrl))
    }

    const sortDESC = (arr) => {
        const result = arr.sort((a, b) => { return b.id - a.id })
        return result
    }

    const handleItLikes = (likes) => {
        // if (likes.length === 0) return false
        // const like = likes.find(key => key['user'].id === userSlice.user.id)

        // if (like !== undefined) {
        //     return true
        // }
        return false
    }

    const handleLikereply = async (replyId, key) => {
        await axios.post(`/likes/reply/${replyId}`, {
            userId: userSlice.user.id
        }).then((res) => {
            fetchReply()
        })
    }

    const fetchReply = async (_limit) => {
        await axios.get(`/reply/${reply.id}/reply-of-reply?limit=${_limit}`).then((res) => {
            if (!res.data.error) {
                setCount(res.data.count)
                setRepliesOfReply(res.data.data)
                console.log(res.data);

                if (res.data.count <= _limit || res.data.count <= 1) {
                    setShowViewMore(false)
                } else {
                    setShowViewMore(true)
                }
            }
        })
    }


    const CommentBody = ({ body }) => {
        const bodyRef = useRef()

        useEffect(() => {
            bodyRef.current.innerHTML = `${body}`
        }, [])

        return (
            <div ref={bodyRef} />
        )
    }

    const handleViewMore = () => {

        if (replyLimit + 3 >= count) {
            fetchReply(count)
            setReplyLimit(count)
        } else {
            fetchReply(replyLimit + 3)
            setReplyLimit(replyLimit + 3)
        }
    }

    useEffect(() => {
        fetchReply(replyLimit)
    }, [])

    useEffect(() => {
        fetchComments(limit)
        fetchReply(replyLimit)
    }, [commentCount])

    return (
        <div className="Replay">
            <div id={`input-repliesOfReply-${reply.id}`} className="input-reply" style={{ display: "none" }}>
                <div className='mt-2' style={{ position: "relative", left: -30, display: "flex"}}>
                    <div className='col-2 mt-3' style={{ display: "flex", justifyContent: "flex-end", paddingRight: 10 }}>
                        <img alt="crypto" className='col-2' style={{ width: 30, height: 30, borderRadius: 100 }}
                            src={userSlice.user.image}
                        />
                    </div>
                    <div className='col pb-3' style={{ paddingRight: 10 }}>
                        <InputProvider wrap={29} mw={425} commentId={reply.id} from={"repliesOfReply"} handleOnPost={handlePostReply} id={`repliesOfReply-${reply.id}`} />
                    </div>
                </div>
            </div>
            {sortDESC(repliesOfReply).map((reply, key) => (
                <div key={key} className='mt-3 background' style={{ display: "flex", position: "relative", left: -20 }}>
                    <Link className='col-2' style={{ display: "flex", justifyContent: "flex-end", paddingRight: 20 }} to={`/u/${reply.user.uuid}`}>
                        <img alt="crypto" className='col-3 mt-2' style={{ width: 30, height: 30, borderRadius: 100, background: "gray" }}
                            src={reply.user.image}
                        />
                    </Link>
                    <div className='col-10 mt-1 reply' style={{ display: "flex", flexDirection: "column", paddingRight: 10 }}>
                        <div className='ps-1 col-12' style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <Link to={`/u/${reply.user.uuid}`} style={{ color: "black" }}>
                                    <b className='text hover-with-underline' >{reply.user.firstName} {reply.user.lastName}</b>
                                </Link>
                                <span className='time ms-2 text' style={{ fontSize: 12 }}>{moment(reply.createdAt).fromNow()}</span>
                            </div>

                            <Popover id={`popover-${reply.id}`} placement="bottom" trigger="click" content={
                                <div className={`${theme} p-content`} style={{ borderColor: theme === "dark" ? "rgb(37, 38, 43)" : "white" }}>
                                    <div style={{ width: 300 }} className="background">
                                        <div className='p-arrow-box'>
                                            <MdArrowDropUp className='p-arrow' style={{ fontSize: 50 }} color={theme === "dark" ? "#1A1B1E" : "white"} />
                                        </div>
                                        <div onClick={() => handleOnDelete(reply.id)} className="item ps-3 hover background" style={{ display: "flex", alignItems: "center", height: 50 }}>
                                            <FontAwesomeIcon className='text' icon={faEyeSlash} style={{ fontSize: 16 }} />
                                            <span className='ms-2 text'>Delete Reply</span>
                                        </div>
                                    </div>

                                </div>
                            }>
                                <FontAwesomeIcon className='text hover' style={{ fontSize: 18, marginRight: 5 }} icon={faEllipsis} />
                            </Popover>
                        </div>
                        <div className='col-11 ps-1 pb-3 text'>
                            <CommentBody body={reply.body} />
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
                            <div onClick={() => handleLikereply(reply.id, key)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                                <FontAwesomeIcon id={`reply-like-icon-${reply.id}`} style={{ fontSize: 14, color: handleItLikes(reply.replyOfReplyLikes) ? "#0073DD" : "#CDCDCD" }} icon={faHeart} />
                                <span style={{ fontSize: 12 }} className='ps-2'>
                                    <b className='text' >Like </b>
                                    <span className='text' id={`reply-like-${reply.id}`}>{reply.replyOfReplyLikes.length}</span>
                                </span>
                            </div>
                            <div className="live ms-3" style={{ display: "flex", alignItems: "center" }}>
                                <FontAwesomeIcon style={{ fontSize: 14, color: "#CDCDCD" }} icon={faShare} />
                                <span style={{ fontSize: 12 }} className='ps-2 text'><b>Reply </b></span>
                            </div>
                        </div>
                    </div>
                    {reply.imageUrl !== null &&
                        <img onClick={() => onShowImageModal(reply.imageUrl)} className='p-2 hover' style={{ width: "100%", paddingRight: 7, borderRadius: 15 }} src={reply.imageUrl} alt="" srcSet="" />
                    }
                </div>
            ))}
            {showViewMore &&
                <div onClick={handleViewMore} className='ps-5 pt-2'>
                    <button className='hover-with-underline' style={{ background: "none", border: "none", color: "gray" }}>{count - replyLimit} More {count - replyLimit === 1 ? "reply" : "replies"}</button>
                </div>
            }
        </div>
    )
}

export default ReplyOfReply