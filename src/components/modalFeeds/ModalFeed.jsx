import React, { useContext, useState, useRef, useEffect } from 'react'
import { ThemeContex } from '../../contexts/ThemeContext'
import { Modal } from 'antd'
import { MdClose, MdDelete, MdMoreVert, MdFavorite, MdShare, MdComment } from 'react-icons/md'
import { Link } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'
import $ from "jquery"
import AuthContext from '../../contexts/AuthContext'
import InputProvider from '../../contexts/InputContext'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import Reply from "./Reply"
import Comments from "./Comments"

const ModalFeed = ({ post, setPost, open, setopen, userId, userImage }) => {
    const { theme } = useContext(ThemeContex)
    const [comments, setComments] = useState([])
    const [count, setCount] = useState(0)
    const [showViewMore, setShowViewMore] = useState(false)
    const [isopen, setIsopen] = useState(false)
    const { setViewMorChange, viewMorChange } = useContext(AuthContext)
    const [limit, setLimit] = useState(10)

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

    const handleOnClickLikes = async (postId) => {
        await axios.post(`likes/${postId}`, { userId: userId }).then((res) => {
            $(`#post-like-icon-${postId}`).css("color", res.data.action === "create" ? "#0073DD" : "#CDCDCD")
            $(`#post-like-${postId}`).text(res.data.likesCount)
        })
    }

    const handleItLikes = (likes) => {
        if (likes?.length === 0) return false
        const like = likes?.find(key => key['userId'] === userId)
        return like !== undefined
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

    const handleonCancel = () => {
        setopen(false)
        setPost({})
    }

    const fetchComments = async (limit) => {
        await axios.get(`/comments/post/${post?.id}?limit=${limit}`).then((res) => {
            if (!res.data.error) {
                setComments(res.data.data)
                setCount(res.data.count)
                console.log(res.data);

                if (res.data.count <= limit || res.data.count <= 1) {
                    setShowViewMore(false)
                } else {
                    setShowViewMore(true)
                }
            }
            setViewMorChange(!viewMorChange)
        })
    }

    const sortDESC = (arr) => {
        const result = arr.sort((a, b) => { return a.id - b.id })
        return result
    }

    const handleOnPost = () => {

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
                                        <MdDelete className='text' style={{ fontSize: 16 }} />
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
        const isInputopen = document.getElementById(`input-modal-${id}`).style.display == "none"
        // `input-modal-${comment.id}`

        // $(`.input-reply`).hide()
        document.getElementById(`input-modal-${id}`).style.display = "block"


        console.log('====================================');
        console.log(isopen, id, isInputopen);
        console.log('====================================');

        // setIsopen(isInputopen)
        // console.log(isInputopen, id);



        // document.getElementById(`searchchable-ModalFeed-${id}`).focus()
    }

    const isHidden = (el) => {
        var style = window.getComputedStyle(el);
        return (style.display === 'none')
    }

    const onCommentClick = () => {
        document.getElementById(`searchchable-${post.uuid}`).focus()
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

                if (!res.data.error) {

                    // fetchReply(replyLimit)
                    // fetchComments(limit)

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
    }, [])

    useEffect(() => {
        fetchComments(limit)
    }, [post])

    return (
        <div className="ModalFeed">
            <Modal
                closeIcon={<MdClose style={_styles.MdClose} />}
                footer={null}
                centered
                open={open}
                onOk={handleonCancel}
                onCancel={handleonCancel}

                width={"80%"}
                bodyStyle={{ background: theme === "light" ? "white" : "#141517", borderRadius: 10 }}
                style={{ height: window.innerHeight - 200, borderRadius: 10 }}
            >
                <div style={{ height: window.innerHeight - 200, background: theme === "light" ? "white" : "#141517", display: "flex", borderRadius: 10 }}>
                    <div id='modal-image-box' className="img-container col" style={{ background: "black", display: "flex", justifyContent: "center", borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                        <img src={post?.imageUrl} alt="post.imageUrl" style={{ maxWidth: 1037, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} height={window.innerHeight - 200} />
                    </div>
                    <div className="img-container row" style={{ display: "flex", color: "white", width: 420, position: "relative" }}>
                        <div className='ms-3 mt-3' style={{ height: "100%" }}>
                            <div style={{ display: "flex" }}>
                                <Link to={`/u/${post.user?.username}`}>
                                    <img style={_styles.imageProfile} src={post.user?.image} alt="post.imageUrl" />
                                </Link>
                                <div className='ps-3 col-12' style={{ display: "flex", flexDirection: "column", }}>
                                    <b className='text'>
                                        <Link style={_styles.text} className='hover-with-underline text' to={`/u/${post.user?.username}`}>
                                            {post.user?.firstName} {post.user?.lastName}
                                        </Link>
                                    </b>
                                    <span style={{ fontSize: 12 }}>
                                        <Link style={_styles.text} className='hover-with-underline text' to={`/p/${post.uuid}`}>{moment(post.createdAt).fromNow()}</Link>
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4" style={{ display: "flex", justifyContent: "space-between", width: 375 }}>
                                <div onClick={() => handleOnClickLikes(post?.id, post?.likes)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                                    <MdFavorite id={`post-like-icon-${post.id}`} style={{ fontSize: 15, color: handleItLikes(post?.likes) ? "#0073DD" : "#CDCDCD" }} />
                                    <b style={_styles.text} className='ps-2 text'>Like</b>
                                    <span id={`post-like-${post?.id}`} className='ps-1 text'>{post.likes?.length > 0 && abbreviateNumber(post.likes?.length)}</span>
                                </div>
                                <div onClick={onCommentClick} className="live hover" style={{ display: "flex", alignItems: "center" }}>
                                    <MdComment style={_styles.text} />
                                    <span className='ps-2 text'><b>Comments</b> {count > 0 && count}</span>
                                </div>
                                <div className="live hover" style={{ display: "flex", alignItems: "center", paddingRight: 20 }}>
                                    <MdShare style={_styles.text} />
                                    <span className='ps-2 text'><b>Share</b> 250</span>
                                </div>
                            </div>
                            <div className="mt-4 pb-3 row to-scroll" style={{ maxHeight: "80%", width: "100%", paddingInline: 10 }}>
                                {comments.map((comment, key) => (
                                    <Comments userId={userId} userImage={userImage} comment={comment} key={key} post={post} />
                                ))}
                            </div>
                        </div>
                        <div style={{ position: "absolute", bottom: 0 }}>
                            <div style={{ paddingInline: 10 }} className='cmt text pb-2' id={`modal-${post?.uuid}`}>
                                <InputProvider wrap={27} from="modal-post" handleOnPost={handleOnPost} id={`modal-${post?.uuid}`} />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalFeed;
