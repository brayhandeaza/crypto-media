import React, { useContext, useState, useRef, useEffect } from 'react'
import { MdVisibility, MdFavorite, MdShare, MdMoreVert } from 'react-icons/md'
import { ThemeContex } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'
import $ from "jquery"
import AuthContext from '../../contexts/AuthContext'
import InputProvider from '../../contexts/InputContext'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import Reply from "./Reply"

const ModalFeed = ({ post, userId, userImage, comment, key }) => {
    const { theme } = useContext(ThemeContex)
    const [count, setCount] = useState(0)
    const [isopen, setIsopen] = useState(false)
    const [replyPosted, setReplyPosted] = useState(false)
    const { setViewMorChange, viewMorChange } = useContext(AuthContext)
    const [limit] = useState(10)

    const _styles = {
        MdClose: {
            width: 30,
            height: 30,
            marginRight: 10,
            fontWeight: "bold",
            color: theme === "dark" ? "white" : "#212529"
        },
        imageProfile: {
            width: 45,
            height: 45,
            borderRadius: 100
        },
        text: {
            color: theme === "dark" ? "white" : "#212529"
        },
        body: {
            paddingInline: 15,
            paddingBlock: 10,
            color: theme === "dark" ? "white" : "#212529"
        }
    }

    const handleDeleteComment = async (id) => {
        await axios.delete(`/comments/${id}`).then(() => {
            fetchComments(limit)
        }).catch((err) => {
            console.error("error:", err)
        })
    }


    const abbreviateNumber = (number) => {
        const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"]
        const tier = Math.log10(Math.abs(number)) / 3 | 0

        if (tier === 0) return number

        const suffix = SI_SYMBOL[tier]
        const scale = Math.pow(10, tier * 3)
        const scaled = number / scale

        return scaled.toFixed(1)[scaled.toFixed(1).length - 1] < 1 ? scaled.toFixed() + suffix : scaled.toFixed(1) + suffix
    }

    const fetchComments = async (limit) => {
        await axios.get(`/comments/post/${post?.id}?limit=${limit}`).then((res) => {
            if (!res.data.error) {
                setCount(res.data.count)
                console.log(res.data);
            }
            setViewMorChange(!viewMorChange)
        })
    }

    const Dropdown = ({ comment }) => {
        const id = new Date(comment.createdAt).getTime()

        return (
            <div>
                <OverlayTrigger
                    rootClose={true}
                    trigger="click"
                    key={'bottom'}
                    placement={'bottom'}
                    overlay={
                        <Popover className={`${theme}`} id={`popover-${id}`} style={{ width: 300, border: "none" }}>
                            <Popover.Body>
                                <div className='p-body'>
                                    <div style={{ height: 50, display: "flex", alignItems: "center" }} onClick={() => handleDeleteComment(comment.id)} className={`ps-3 hover first-last ${theme}  ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                        <MdVisibility className='text' style={{ fontSize: 16 }} />
                                        <span className='ms-2 text'>Delete comment</span>
                                    </div>
                                </div>
                            </Popover.Body>
                        </Popover>
                    }>
                    <div className='m-2'>
                        <MdMoreVert className='text hover' style={{ fontSize: 20, color: theme === "dark" ? "white" : "#212529" }} />
                    </div>
                </OverlayTrigger>
            </div>
        );
    }

    const CommentBody = ({ body }) => {
        const bodyRef = useRef()

        useEffect(() => {
            bodyRef.current.innerHTML = `${body}`
        }, [])

        return (
            <div className='body text' style={_styles.body} ref={bodyRef}></div>
        )
    }

    const onShowImageModal = (imageUrl) => {
        // props.dispatch({ type: "SHOW_IMAGE_MODAL", data: imageUrl })
        // dispatch(showCommentMedia())
    }

    const handleLikeComment = async (commentId) => {
        await axios.post(`likes/comment/${commentId}`, { userId }).then((res) => {
            $(`#comment-like-${commentId}`).text(`${abbreviateNumber(res.data.likesCount)}`)
            $(`#comment-like-icon-${commentId}`).css("color", res.data.action === "create" ? "#0073DD" : "#CDCDCD")
            fetchComments(limit)
        })
    }

    const handleILikesIt = (likes) => {
        if (likes.length === 0) return false
        const like = likes.find(key => key['user']["id"] === userId)
        return like !== undefined
    }

    const handleShowReply = (id) => {
        $(`.input-reply`).hide()
        setIsopen(!isopen)
    }

    const handlePostReply = async ({ commentId, body, hasMedia, file }) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ugy6mqfd")

        if (hasMedia) {
            await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData).then(async _file => {

                await axios.post("/reply", {
                    commentId,
                    userId,
                    body,
                    imageUrl: _file.data.url,
                }).then((res) => {
                    // fetchReply(replyLimit)
                    fetchComments(limit)
                    setIsopen(false)

                    $(`#searchchable-${commentId}`).empty()
                    $(`#input-reply-${commentId}`).toggle()

                    const replyElm = document.getElementById(`reply-scroll-to-${commentId}`)
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
                userId,
                body,
                imageUrl: null
            }).then((res) => {
                console.log(res.data)
                if (!res.data.error) {
                    setReplyPosted(!replyPosted)
                    setIsopen(false)

                    // fetchReply(replyLimit)
                    fetchComments(limit)

                    $(`#searchchable-${commentId}`).empty()
                    $(`#input-reply-${commentId}`).toggle()

                    const replyElm = document.getElementById(`reply-scroll-to-${commentId}`)
                    replyElm.scrollIntoView()
                }
            })
        }
    }

    useEffect(() => {
        fetchComments(limit)
    }, [post])

    useEffect(() => {
        fetchComments(limit)
    }, [])

    return (
        <section key={key} id={`comment-${comment?.id}`} className='Comments ps-2' style={{ paddingRight: 10, }}>
            <div style={{ display: "flex", marginBottom: 20 }}>
                <div id={`coment-image-${comment?.id}`} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Link style={_styles.text} to={`/u/${comment.user?.username}`}>
                        <img alt="crypto" className='col-3 hover' style={{ width: 40, height: 40, borderRadius: 100, marginRight: 10 }} src={comment.user?.image} />
                    </Link>
                </div>
                <div className="commnt-body" style={{ width: "100%" }}>
                    <div className='ps-1 col-12' style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <Link style={_styles.text} className='hover-with-underline text' to={`/u/${comment.user?.username}`}>
                                <b>{comment.user?.firstName} {comment.user?.lastName}</b>
                            </Link>
                            <span className='time ms-2 text' style={{ fontSize: 12 }}>{moment(comment.createdAt).fromNow()}</span>
                        </div>
                        <Dropdown comment={comment} />
                    </div>
                    <div style={{ display: "flex" }}>
                        {comment?.body && <div className='text' style={{ background: theme === "light" ? "#F1F3F5" : "#2C2E33", width: "auto", borderRadius: 10 }}>
                            <CommentBody body={comment?.body} />
                        </div>}
                    </div>
                    {comment?.imageUrl !== null && <img onClick={() => onShowImageModal(comment?.imageUrl)} className='mt-2 hover' style={{ width: "100%", borderRadius: 15 }} src={comment?.imageUrl} alt="" srcSet="" />}
                    <div className='mt-2' style={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
                        <div onClick={() => handleLikeComment(comment?.id)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                            <MdFavorite id={`comment-like-icon-${comment?.id}`} style={{ fontSize: 14, color: handleILikesIt(comment?.commentLikes) ? "#0073DD" : "#CDCDCD" }} />
                            <span style={{ fontSize: 12 }} className='ps-2 text'>
                                <b style={_styles.text}>Like </b>
                                <span id={`comment-like-${comment?.id}`}>{comment.commentLikes?.length}</span>
                            </span>
                        </div>
                        <div onClick={() => handleShowReply(comment?.id)} className="live hover ms-3" style={{ display: "flex", alignItems: "center" }}>
                            <MdShare style={{ fontSize: 14, color: "#CDCDCD" }} />
                            <span style={{ fontSize: 12, color: theme === "dark" ? "white" : "#212529" }} className='ps-2 text'><b>Reply </b>{comment.replies?.length > 0 && comment.replies?.length}</span>
                        </div>
                    </div>
                    {isopen && <div id={`input-modal-${comment.id}`} className="input-reply" style={{ display: "block" }}>
                        <div className='mt-2' style={{ position: "relative", right: 10, display: "flex" }}>
                            <div className='col-2' style={{ display: "flex", justifyContent: "flex-end", paddingRight: 10 }}>
                                <img alt="crypto" className='col-2 mt-3' style={{ width: 30, height: 30, borderRadius: 100 }}
                                    src={userImage}
                                />
                            </div>
                            <div className='col pb-3' id={`reply-comment-${comment.id}`} style={{ display: "flex", flexDirection: "column" }}>
                                <InputProvider mw={500} wrap={37} postId={comment.postId} commentId={comment.id} from={"ModalFeed"} handleOnPost={handlePostReply} id={`ModalFeed-${comment.id}`.toString()} />
                            </div>
                        </div>
                    </div>}
                    <Reply replyPosted={replyPosted} from={"ModalFeed"} commentCount={count} limit={limit} postId={comment.postId} fetchComments={fetchComments} comment={comment} replies={comment.replies} />
                </div>
            </div>
        </section >
    )
}

export default ModalFeed;
