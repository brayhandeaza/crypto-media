import React, { useContext, useEffect, useState, useRef } from 'react'
import { MdEdit, MdDelete, MdFavorite, MdMoreHoriz, MdComment, MdShare } from 'react-icons/md'
import axios from 'axios'
import moment from 'moment'
import { connect, useDispatch, useSelector } from 'react-redux'
import $ from "jquery"
import { Link } from 'react-router-dom'
import ImageModals from '../post/ImageModals'
import { showCommentMedia } from '../../redux/slicers/modalSlice'
import Reply from "./Reply"
import Input from '../Input'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import { ThemeContex } from '../../contexts/ThemeContext'
import InputProvider from '../../contexts/InputContext'
import AuthContext from '../../contexts/AuthContext'

const Comments = (props) => {
    const { post } = props
    const [reply, setReply] = useState(false)
    const [showViewMore, setShowViewMore] = useState(false)
    const [comments, setComments] = useState([])
    const [limit, setLimit] = useState(2)
    const [count, setCount] = useState(0)
    const { userSlice } = useSelector(state => state)
    const { theme } = useContext(ThemeContex)
    const { setViewMorChange, viewMorChange } = useContext(AuthContext)
    const dispatch = useDispatch()

    const handleShowReply = (id) => {
        const isopen = $(`#searchchable-${id}`).is(":open")

        $(`.input-reply`).hide()
        $(`#input-reply-${id}`).css("display", isopen ? "none" : "block")


        const isCommentFeedopen = $(`#post-comment-feed-${id}`).is(":open")
        $(`#post-comment-feed-${id}`).css("display", isCommentFeedopen ? "none" : "flex")

        document.getElementById(`searchchable-${id}`).focus()
    }

    const handleILikesIt = (likes) => {
        if (likes.length === 0) return false
        const like = likes.find(key => key['user']["id"] === userSlice.user.id)
        return like !== undefined
    }

    const handleLikeComment = async (commentId) => {
        await axios.post(`likes/comment/${commentId}`, { userId: userSlice.user.id }).then((res) => {
            $(`#comment-like-${commentId}`).text(`${abbreviateNumber(res.data.likesCount)}`)
            $(`#comment-like-icon-${commentId}`).css("color", res.data.action === "create" ? "#0073DD" : "#CDCDCD")
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

    const sortDESC = (arr) => {
        const result = arr.sort((a, b) => { return a.id - b.id })
        return result
    }

    const handleViewMore = () => {

        if (limit + 3 >= count) {
            setLimit(count)
            fetchComments(count)
        } else {
            setLimit(limit + 3)
            fetchComments(limit + 3)
        }
    }

    const onShowImageModal = (imageUrl) => {
        // props.dispatch({ type: "SHOW_IMAGE_MODAL", data: imageUrl })
        dispatch(showCommentMedia())
    }

    const handleItLikes = (likes) => {
        if (likes.length === 0) return false
        const like = likes.find(key => key['userId'] === userSlice.user.id)
        return like !== undefined
    }

    const handleOnClickLikes = async (postId, likes) => {
        await axios.post(`likes/${postId}`, { userId: userSlice.user.id }).then((res) => {
            $(`#post-like-icon-${postId}`).css("color", res.data.action === "create" ? "#0073DD" : "#CDCDCD")
            $(`#post-like-${postId}`).text(res.data.likesCount)
        })
    }

    const handleDeleteComment = async (id) => {
        await axios.delete(`/comments/${id}`).then(() => {
            fetchComments(limit)
        }).catch((err) => {
            console.error("error:", err)
        })
    }

    const fetchComments = async (limit) => {
        await axios.get(`/comments/post/${props.post?.id}?limit=${limit}`).then((res) => {
            if (!res.data.error) {
                setComments(res.data.data)
                setCount(res.data.count)

                if (res.data.count <= limit || res.data.count <= 1) {
                    setShowViewMore(false)
                } else {
                    setShowViewMore(true)
                }
            }
            setViewMorChange(!viewMorChange)
        })
    }

    const CommentBody = ({ body }) => {
        const bodyRef = useRef()

        useEffect(() => {
            bodyRef.current.innerHTML = `${body}`
        }, [])

        return (
            <div className='body text' style={{ paddingInline: 15, paddingBlock: 10 }} ref={bodyRef}></div>
        )
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
                        <Popover className={`${theme}`} id={`popover-${id}`} style={{ width: 200, border: "none" }}>
                            <Popover.Body>
                                <div className='p-body'>
                                    <div style={{ height: 50, display: "flex", alignItems: "center" }} onClick={() => handleDeleteComment(comment.id)} className={`ps-3 hover first ${theme}  ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                        <MdEdit className='text' style={{ fontSize: 16 }} />
                                        <span className='ms-2 text'>Edit</span>
                                    </div>
                                    <div style={{ height: 50, display: "flex", alignItems: "center" }} onClick={() => handleDeleteComment(comment.id)} className={`ps-3 hover last ${theme}  ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                        <MdDelete className='text' style={{ fontSize: 16 }} />
                                        <span className='ms-2 text'>Delete</span>
                                    </div>
                                </div>
                            </Popover.Body>
                        </Popover>
                    }>
                    <div className='m-2'>
                        <MdMoreHoriz className='text hover' style={{ fontSize: 25 }} />
                    </div>
                </OverlayTrigger>
            </div>
        );
    }

    const onCommentClick = () => {
        document.getElementById(`searchchable-${post.uuid}`).focus()
    }

    const handleOnPost = async ({ body, file, hasMedia }) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ugy6mqfd")

        if (hasMedia) {
            const file = await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData)
            if (file) {
                await axios.post("/comments", {
                    postId: post.id,
                    userId: userSlice.user.id,
                    body: body === "" ? null : body,
                    imageUrl: file.data.url,
                    parentId: null
                }).then(() => {
                    fetchComments(limit)
                    setLimit(3)

                    $(`#input-from-post-${post.id}`).val("")
                    $(`#toggle-comment-from-${post.id}`).show()
                    $(`#button-post-${post.uuid}`).hide()
                    $(`#searchchable-${post.uuid}`).empty()

                    const replyElm = document.getElementById(`comment-scroll-to-${post.id}`)
                    replyElm.scrollIntoView({ "behavior": "smooth" })
                })
            }
        } else {
            await axios.post("/comments", {
                postId: post.id,
                userId: userSlice.user.id,
                body,
                imageUrl: null,
                parentId: null
            }).then(() => {
                fetchComments(limit)
            })
        }
        setComments([])
    }

    const handlePostReply = async ({ commentId, body, hasMedia, file }) => {
        const userId = userSlice.user.id
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
                    // setIsopen(false)

                    $(`#searchchable-${commentId}`).empty()
                    $(`#input-reply-${commentId}`).toggle()
                    $(`#post-comment-feed-${commentId}`).css("display", "none")

                    // const replyElm = document.getElementById(`reply-scroll-to-${commentId}`)
                    // replyElm.scrollIntoView()

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
                    // setReplyPosted(!replyPosted)
                    // setIsopen(false)

                    // fetchReply(replyLimit)
                    fetchComments(limit)

                    $(`#searchchable-${commentId}`).empty()
                    $(`#input-reply-${commentId}`).toggle()

                    // const replyElm = document.getElementById(`reply-scroll-to-${commentId}`)
                    // replyElm.scrollIntoView()
                }
            })
        }
    }



    useEffect(() => {
        fetchComments(limit)
    }, [])

    return (
        <div>
            <div className="mt-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
                <div onClick={() => handleOnClickLikes(post?.id, post?.likes)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 20 }}>
                    <MdFavorite id={`post-like-icon-${post.id}`} style={{ fontSize: 20, color: handleItLikes(post?.likes) ? "#0073DD" : "#CDCDCD" }} />
                    <b className='ps-2 text'>Like</b>
                    <span id={`post-like-${post?.id}`} className='ps-1 text'>{post.likes?.length > 0 && abbreviateNumber(post.likes?.length)}</span>
                </div>
                <div onClick={onCommentClick} className="live hover" style={{ display: "flex", alignItems: "center" }}>
                    <MdComment style={{ fontSize: 20, color: "#CDCDCD" }} />
                    <span className='ps-2 text'><b>Comments</b> {count > 0 && count}</span>
                </div>
                <div className="live hover" style={{ display: "flex", alignItems: "center", paddingRight: 20 }}>
                    <MdShare style={{ fontSize: 20, color: "#CDCDCD" }} />
                    <span className='ps-2 text'><b>Share</b> 250</span>
                </div>
            </div>
            <div className='cmt text' id={`comment-post-${post?.id}`}>
                <InputProvider wrap={27} from="comment" handleOnPost={handleOnPost} id={post.uuid} />
            </div>
            {showViewMore &&
                <div onClick={handleViewMore} className='ps-2 pt-2'>
                    <button className='hover-with-underline' style={{ background: "none", border: "none", color: "gray" }}>{count - limit} More comment{count - limit === 1 ? "" : "s"}</button>
                </div>
            }
            {sortDESC(comments).map((comment, key) => (
                <section key={key} id={`comment-${comment.id}`} className='Comments mt-4 ps-2' style={{ paddingRight: 10 }}>
                    <div style={{ display: "flex" }}>
                        <div id={`coment-image-${comment.id}`} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Link to={`/u/${comment.user.username}`}>
                                <img alt="crypto" className='col-3 hover' style={{ width: 40, height: 40, borderRadius: 100, marginRight: 10 }} src={comment.user.image} />
                            </Link>
                        </div>
                        <div className="commnt-body" style={{ width: "100%" }}>
                            <div className='ps-1 col-12' style={{ display: "flex", justifyContent: "space-between", paddingBottom: 0 }}>
                                <div>
                                    <Link className='hover-with-underline text' to={`/u/${comment.user.username}`}>
                                        <b>{comment.user.firstName} {comment.user.lastName}</b>
                                    </Link>
                                    <Link style={{ fontSize: 12 }} className='hover-with-underline text ms-2 time' to={`/p/${post.uuid}`}>{moment(comment.createdAt).fromNow()}</Link>
                                </div>
                                <Dropdown comment={comment} />
                            </div>
                            <div style={{ display: "flex" }}>
                                {comment.body && <div className='text' style={{ background: theme === "light" ? "#F1F3F5" : "#2C2E33", width: "auto", borderRadius: 10 }}>
                                    <CommentBody body={comment.body} />
                                </div>}
                            </div>
                            {comment.imageUrl !== null && <img onClick={() => onShowImageModal(comment.imageUrl)} className='mt-2 hover' style={{ width: "100%", borderRadius: 15 }} src={comment.imageUrl} alt="" srcSet="" />}
                            <div className='mt-2' style={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
                                <div onClick={() => handleLikeComment(comment.id)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                                    <MdFavorite id={`comment-like-icon-${comment.id}`} style={{ fontSize: 14, color: handleILikesIt(comment.commentLikes) ? "#0073DD" : "#CDCDCD" }} />
                                    <span style={{ fontSize: 12 }} className='ps-2 text'>
                                        <b>Like </b>
                                        <span id={`comment-like-${comment.id}`}>{comment.commentLikes.length}</span>
                                    </span>
                                </div>
                                <div onClick={() => handleShowReply(comment.id)} className="live hover ms-3" style={{ display: "flex", alignItems: "center" }}>
                                    <MdShare style={{ fontSize: 14, color: "#CDCDCD" }} />
                                    <span style={{ fontSize: 12 }} className='ps-2 text'><b>Reply </b>{comment.replies.length > 0 && comment.replies.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id={`post-comment-feed-${comment.id}`} className='mt-2' style={{ position: "relative", right: 10, display: "none" }}>
                        <div className='col-2' style={{ display: "flex", justifyContent: "flex-end", paddingRight: 10 }}>
                            <img alt="crypto" className='col-2 mt-3' style={{ width: 30, height: 30, borderRadius: 100 }}
                                src={userSlice?.user?.image}
                            />
                        </div>
                        <div className='col pb-3' id={`reply-comment-${comment.id}`} style={{ display: "flex", flexDirection: "column" }}>
                            <InputProvider mw={500} wrap={37} postId={comment.postId} commentId={comment.id} from={"ModalFeed"} handleOnPost={handlePostReply} id={`ModalFeed-${comment.id}`.toString()} />
                        </div>
                    </div>
                    <Reply post={post} from={"reply"} commentCount={count} limit={limit} postId={comment.postId} fetchComments={fetchComments} comment={comment} replies={comment.replies} />
                </section >
            ))}
            <span id={`comment-scroll-to-${post.id}`}></span>
            <ImageModals />
        </div>
    )

}


const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Comments)
