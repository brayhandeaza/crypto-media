import React, { useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { faEllipsis, faHeart, faShare, faRemove, faEdit } from '@fortawesome/free-solid-svg-icons'
import $ from "jquery"
import { Link } from 'react-router-dom'
import { ThemeContex } from '../../contexts/ThemeContext'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import { MdArrowDropUp } from 'react-icons/md'
import InputProvider from '../../contexts/InputContext'
import AuthContext from '../../contexts/AuthContext'
import ReplyOfReply from './ReplyOfReply'

const Reply = ({ postId, comment, fetchComments, limit, commentCount, from, post }) => {
    const [replies, setReplies] = useState([])
    const { userSlice } = useSelector(state => state)
    const [count, setCount] = useState("")
    const [showViewMore, setShowViewMore] = useState(false)
    const [replyLimit, setReplyLimit] = useState(1)
    const [title, setTitle] = useState("Post")

    const { theme } = useContext(ThemeContex)
    const { viewMorChange } = useContext(AuthContext)

    const handleShowReply = (id) => {
        const isopen = $(`#searchchable-${id}`).is(":open")
        setTitle("Post")

        $(`.input-reply`).hide()
        $(`#input-modal-${id}`).css("display", isopen ? "none" : "block")

        const isCommentFeedopen = $(`#post-comment-reply-feed-${id}`).is(":open")
        $(`#post-comment-reply-feed-${id}`).css("display", isCommentFeedopen ? "none" : "flex")

        document.getElementById(`searchchable-${from}-${id}`).focus()
    }

    const handleOnDelete = async (id) => {
        await axios.delete(`reply/${id}`, { hidden: true }).then((res) => {
            fetchReply(replyLimit)
            fetchComments(limit)


        }).catch((err) => {
            console.error("error:", err)
        })
    }

    const handleOnEdit = async (reply) => {
        setTitle("Edit")
        $(`.popover`).removeClass("show")
        $(`#post-comment-reply-feed-${reply.id}`).css("display", "flex")
        $(`#searchchable-ModalFeed-reply-${reply.id}`).html(reply.body)
    }

    const handlePostReply = async ({ commentId, body, hasMedia, file }) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ugy6mqfd")

        if (hasMedia) {
            await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData).then(async _file => {

                await axios.post("/reply", {
                    commentId,
                    userId: userSlice.user.id,
                    body,
                    imageUrl: _file.data.url,
                }).then((res) => {
                    fetchReply(replyLimit)
                    fetchComments(limit)

                    $(`#searchchable-${commentId}`).empty()
                    $(`#input-reply-${commentId}`).toggle()

                    const replyElm = document.getElementById(`reply-scroll-to-${comment.id}`)
                    replyElm.scrollIntoView()

                }).catch(err => {
                    console.log(err.toString());
                })
            }).catch(err => {
                console.log(err.toString());
            })
        } else {
            await axios.post("/reply", {
                commentId,
                userId: userSlice.user.id,
                body,
                imageUrl: null
            }).then((res) => {

                if (!res.data.error) {

                    // fetchReply(replyLimit)
                    fetchComments(limit)

                    $(`#searchchable-${commentId}`).empty()
                    $(`#input-reply-${commentId}`).toggle()
                    $(`.post-comment-reply-feed`).css("display", "none")


                    // const replyElm = document.getElementById(`reply-scroll-to-${comment.id}`)
                    // replyElm.scrollIntoView()
                }
            })
        }
    }

    const onShowImageModal = (imageUrl) => {
        // // props.dispatch({ type: "SHOW_IMAGE_MODAL", payload: imageUrl })
        // dispatch(showCommentMedia(imageUrl))
    }

    const sortDESC = (arr) => {
        const result = arr.sort((a, b) => { return a.id - b.id })
        return result
    }

    const handleItLikes = (likes) => {
        if (likes.length === 0) return false
        const like = likes.find(key => key['userId'] === userSlice.user.id)

        if (like !== undefined) {
            return true
        }
        return false
    }

    const handleLikereply = async (replyId, key) => {
        await axios.post(`/likes/reply/${replyId}`, {
            userId: userSlice.user.id
        }).then((res) => {
            fetchReply(replyLimit)
        })
    }

    const fetchReply = async (_limit) => {
        await axios.get(`/reply/comment/${comment.id}?limit=${_limit}`).then((res) => {
            if (!res.data.error) {
                setCount(res.data.count)
                setReplies(res.data.data)

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
            bodyRef.current.innerHTML = bodyRef.current.innerHTML !== "null" && `${body}`
        }, [])

        return (
            <div style={{ paddingInline: 15, paddingBlock: 10, color: theme === "dark" ? "white" : "#212529" }} ref={bodyRef}></div>
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

    const Dropdown = ({ reply }) => {
        const id = new Date(reply.createdAt).getTime()

        return (
            <div>
                <OverlayTrigger
                    rootClose={true}
                    trigger="click"
                    key={'bottom'}
                    placement={'bottom'}
                    overlay={
                        <Popover className={`${theme}`} id={`popover-${id}`} style={{ width: 200, border: "none" }}>
                            <Popover.Body>
                                <div className='p-body'>
                                    {/* <div style={{ height: 50, display: "flex", alignItems: "center" }} onClick={() => handleOnEdit(reply)} className={`ps-3 hover first ${theme}  ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                        <FontAwesomeIcon className='text' icon={faEdit} style={{ fontSize: 16 }} />
                                        <span className='ms-2 text'>Edit</span>
                                    </div> */}
                                    <div style={{ height: 50, display: "flex", alignItems: "center" }} onClick={() => handleOnDelete(reply.id)} className={`ps-3 hover first-last ${theme}  ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                        <FontAwesomeIcon className='text' icon={faRemove} style={{ fontSize: 16 }} />
                                        <span className='ms-2 text'>Delete</span>
                                    </div>
                                </div>
                            </Popover.Body>
                        </Popover>
                    }>
                    <div className='btn'>
                        <FontAwesomeIcon className='text hover' style={{ fontSize: 20, color: theme === "dark" ? "white" : "#212529" }} icon={faEllipsis} />
                    </div>
                </OverlayTrigger>
            </div>
        );
    }

    useEffect(() => {
        fetchReply(replyLimit)
    }, [])

    useEffect(() => {
        fetchComments(limit)
        fetchReply(replyLimit)

    }, [commentCount])

    useEffect(() => {
        fetchReply(replyLimit)
    }, [viewMorChange])


    return (
        <div className="Replay">
            <div id={`input-modal-${comment.id}`} className="input-reply" style={{ display: "none" }}>
                <div className='mt-2' style={{ position: "relative", right: 10, display: "flex" }}>
                    <div className='col-2' style={{ display: "flex", justifyContent: "flex-end", paddingRight: 10 }}>
                        <img alt="crypto" className='col-2 mt-3' style={{ width: 30, height: 30, borderRadius: 100 }}
                            src={userSlice.user.image}
                        />
                    </div>
                    <div className='col pb-3' id={`reply-comment-${comment.id}`} style={{ display: "flex", flexDirection: "column" }}>
                        <InputProvider mw={500} wrap={37} postId={postId} commentId={comment.id} from={from} handleOnPost={handlePostReply} id={from === "ModalFeed" ? `ModalFeed-${comment.id}` : comment.id} />
                    </div>
                </div>
            </div>
            {showViewMore &&
                <div onClick={handleViewMore} className='ps-5 pt-2'>
                    <button className='hover-with-underline' style={{ background: "none", border: "none", color: "gray" }}>{count - replyLimit} More {count - replyLimit === 1 ? "reply" : "replies"}</button>
                </div>
            }
            {sortDESC(replies).map((reply, key) => (
                <section id={`reply-${reply.id}`} key={key} className='mt-3 background' style={{ display: "flex" }}>
                    <Link className='col-2' style={{ display: "flex", justifyContent: "flex-end", paddingRight: 20 }} to={`/u/${reply.user.username}`}>
                        <img alt="crypto" className='col-3 mt-2' style={{ width: 30, height: 30, borderRadius: 100, background: "gray" }}
                            src={reply.user.image}
                        />
                    </Link>
                    <div className='col-10 mt-1 reply' style={{ display: "flex", flexDirection: "column" }}>
                        <div className='ps-1 col-12' style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <Link to={`/u/${reply.user.username}`} style={{ color: theme === "dark" ? "white" : "#212529" }}>
                                    <b className='text hover-with-underline' >{reply.user.firstName} {reply.user.lastName}</b>
                                </Link>
                                <Link style={{ fontSize: 12 }} className='hover-with-underline text ms-2 time' to={`/p/${post.uuid}`}>{moment(reply.createdAt).fromNow()}</Link>
                                {/* <span className='time ms-2 text' style={{ fontSize: 12 }}>{moment(reply.createdAt).fromNow()}</span> */}
                            </div>
                            <Dropdown reply={reply} />
                        </div>
                        <div style={{ display: "flex" }}>
                            <div className='col-11 text mt-1' style={{ background: theme === "light" ? "#F1F3F5" : "#2C2E33", width: "auto", borderRadius: 10 }}>
                                <CommentBody body={reply.body} />
                            </div>
                        </div>
                        {reply.imageUrl !== null &&
                            <img onClick={() => onShowImageModal(reply.imageUrl)} className=' pb-3 hover' style={{ width: "100%", paddingRight: 7, borderRadius: 15 }} src={reply.imageUrl} alt="" srcSet="" />
                        }
                        <div className='mt-2' style={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
                            <div onClick={() => handleLikereply(reply.id, key)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                                <FontAwesomeIcon id={`reply-like-icon-${reply.id}`} style={{ fontSize: 14, color: handleItLikes(reply.replyLikes) ? "#0073DD" : "#CDCDCD" }} icon={faHeart} />
                                <span style={{ fontSize: 12 }} className='ps-2'>
                                    <b className='text' >Like </b>
                                    <span className='text' id={`reply-like-${reply.id}`}>{reply.replyLikes.length}</span>
                                </span>
                            </div>
                            <div onClick={() => handleShowReply(reply.id)} className="live hover ms-3" style={{ display: "flex", alignItems: "center" }}>
                                <FontAwesomeIcon style={{ fontSize: 14, color: "#CDCDCD" }} icon={faShare} />
                                <span style={{ fontSize: 12 }} className='ps-2 text'><b>Reply </b>{ }</span>
                            </div>
                        </div>
                        <div id={`post-comment-reply-feed-${reply.id}`} className='mt-2 post-comment-reply-feed' style={{ position: "relative", right: 90, display: "none" }}>
                            <div className='col-2' style={{ display: "flex", justifyContent: "flex-end", paddingRight: 10 }}>
                                <img alt="crypto" className='col-2 mt-3' style={{ width: 30, height: 30, borderRadius: 100 }}
                                    src={userSlice?.user?.image}
                                />
                            </div>
                            <div className='col pb-3' id={`reply-comment-${comment.id}`} style={{ display: "flex", flexDirection: "column" }}>
                                <InputProvider title={title} mw={500} wrap={37} postId={comment.postId} commentId={comment.id} from={"ModalFeed"} handleOnPost={handlePostReply} id={`ModalFeed-reply-${reply.id}`.toString()} />
                            </div>
                        </div>
                        {/* <ReplyOfReply replyCount={count} replyLimit={replyLimit} fetchComments={fetchComments} reply={reply} replies={comment.replies} /> */}
                    </div>
                </section>
            ))}
            <span id={`reply-scroll-to-${comment.id}`}></span>
        </div>
    )
}

export default Reply