import React, { useContext, useEffect, useState } from 'react'
import { faEarthAmerica, faEllipsis, faFlag, faLink, faTrashCan, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Comments from "./Comments"
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { ThemeContex } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'
import { deleteFeed, fetchFeeds, unfallowUser } from '../../redux/apiFetchs'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { showEdit } from '../../redux/slicers/modalSlice'
import { MdClose, MdContentCopy } from 'react-icons/md'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import { notification, Modal, Button } from 'antd'
import ModalFeed from '../modalFeeds/ModalFeed'


const Feeds = () => {
    const [posts, setPosts] = useState([])
    const [post, setPost] = useState({})
    const [imageUrl, setImageUrl] = useState("")
    const [open, setopen] = useState(false)
    const [currentUser, setCurrentUser] = useState([])
    const { theme } = useContext(ThemeContex)
    const { userSlice, feedsSlice } = useSelector(state => state)
    const dispatch = useDispatch()

    const openNotification = (link) => {
        notification.config({
            placement: "bottomLeft",
            duration: 5
        })
        notification.open({
            style: {
                background: theme === "dark" ? "#2C2E33" : "white",
                color: theme === "dark" ? "white" : "#101113",
                borderRadius: 15,
            },
            message: <div style={{ color: theme === "dark" ? "white" : "#101113" }}>Link copy successfully
                <a href={link} target="blank" style={{ color: "rgb(0, 115, 221)" }}> Open Link</a>
            </div>,

            onClick: () => {
                console.log('Notification Clicked!');
            },
            closeIcon: <MdClose size={20} color={theme === "dark" ? "white" : "#101113"} />,
            icon: <MdContentCopy size={20} color={theme === "dark" ? "rgba(255, 255, 255, 0.487)" : "rgba(000, 000, 000, 0.487)"} />,

        })
    }

    const handleDeletePost = (postId) => {
        dispatch(deleteFeed(postId))
    }

    const handleUnfollow = (post) => {
        dispatch(unfallowUser({
            userId: currentUser.id,
            followingId: post.user.id
        }))
    }

    const handleEditPost = (post) => {
        dispatch(showEdit(post))
    }

    const fetchPosts = async (id) => {
        setCurrentUser(userSlice.user)
        dispatch(fetchFeeds(id))
    }

    // const ModalFeed = (image) => {
    //     const _styles = {
    //         width: 30,
    //         height: 30,
    //         marginRight: 10,
    //         fontWeight: "bold",
    //         color: theme === "dark" ? "white" : "rgb(166, 167, 171)"
    //     }

    //     return (
    //         <div>
    //             <Button type="primary" onClick={() => setopen(true)}>
    //                 Open Modal of 1000px width
    //             </Button>
    //             <Modal
    //                 closeIcon={<MdClose style={_styles} />}
    //                 footer={null}
    //                 centered
    //                 open={open}
    //                 onOk={() => setopen(false)}
    //                 onCancel={() => setopen(false)}
    //                 width={"80%"}
    //                 bodyStyle={{ background: theme === "light" ? "white" : "#141517", borderRadius: 10 }}
    //                 style={{ height: window.innerHeight - 200 }}
    //             >
    //                 <div style={{ height: window.innerHeight - 200, background: theme === "light" ? "white" : "#141517" }}>

    //                 </div>

    //             </Modal>
    //         </div>
    //     )
    // }

    const handleImageClick = (post) => {
        setopen(true)
        setPost(post)
    }

    useEffect(() => {
        if (JSON.stringify(userSlice.user) !== "{}") {
            fetchPosts(userSlice.user.id)
        }
    }, [userSlice])

    useEffect(() => {
        if (JSON.stringify(feedsSlice.feeds) !== "[]") {
            setPosts(feedsSlice.feeds)
        }

    }, [feedsSlice])


    const Dropdown = ({ post }) => {

        return (
            <div>
                <OverlayTrigger rootClose={true} trigger="click" key={'bottom'} placement={'bottom'} overlay={
                    <Popover className={`${theme}`} id={Date.now()} style={{ width: 300 }}>
                        <Popover.Body>
                            <div className='p-body'>
                                {post.userId === currentUser.id ?
                                    <div>
                                        <div className={`first ps-3 ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                            <div onClick={() => handleEditPost(post)}
                                                style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                <FontAwesomeIcon className='text' icon={faEarthAmerica} style={{ fontSize: 14 }} />
                                                <span className='ms-2 text'>Edit Privacy</span>
                                            </div>
                                        </div>
                                        <div onClick={() => openNotification(`${window.location}p/${post.uuid}`)} className={` ps-3 ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                            <CopyToClipboard text={`${window.location}p/${post.uuid}`}>
                                                <div style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                    <FontAwesomeIcon className='text' icon={faLink} style={{ fontSize: 14 }} />
                                                    <span className='ms-2 text'>Copy link to post</span>
                                                </div>
                                            </CopyToClipboard>
                                        </div>
                                        <div className={`last ps-3 ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                            <div onClick={() => handleDeletePost(post.id)}
                                                style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                <FontAwesomeIcon className='text' icon={faTrashCan} style={{ fontSize: 14 }} />
                                                <span className='ms-2 text'>Delete post</span>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className='ps-3'>
                                        <span className={`firts ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`} >
                                            <CopyToClipboard text={`${window.location}brayhandeaza/post/${post.id}`}>
                                                <div className="item ps-2"
                                                    style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                    <FontAwesomeIcon className='text' icon={faLink} style={{ fontSize: 14 }} />
                                                    <span className='ms-2 text'>Copy link to post</span>
                                                </div>
                                            </CopyToClipboard>
                                        </span>
                                        <span className={` ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                            <div onClick={() => handleUnfollow(post)}
                                                style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                <FontAwesomeIcon className='text' icon={faUserXmark} style={{ fontSize: 14 }} />
                                                <span className='ms-2 text'>Unfollow <b>{post.user.firstName} {post.user.lastName}</b></span>
                                            </div>
                                        </span>
                                        <span className={`last ${theme === "dark" ? "hoverWithBGDark" : "hoverWithBGLight"}`}>
                                            <div onClick={() => { }}
                                                style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                <FontAwesomeIcon className='text' icon={faFlag} style={{ fontSize: 14 }} />
                                                <span className='ms-2 text'>Is this post about crypto?</span>
                                            </div>
                                        </span>
                                    </div>
                                }
                            </div>
                        </Popover.Body>
                    </Popover>
                }>
                    <div className="btn">
                        <FontAwesomeIcon className='text' style={{ fontSize: 20 }} icon={faEllipsis} />
                    </div>
                </OverlayTrigger>
            </div>
        );
    }

    return (
        <div>
            {posts.map((post, key) => (
                <div key={key} id={`post-${post.id}`} className='Feed mb-3 p-3 background' style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                        <div className='col-1' style={{ display: "flex", width: "100%" }}>
                            <div className='col-11' style={{ display: "flex" }}>
                                <Link className='hover-with-underline text' to={`/u/${post.user.username}`}>
                                    <img alt="crypto" className='col-3 t-2' style={{ width: 42, height: 42, borderRadius: 100 }} src={post?.user.image} />
                                </Link>
                                <div className='ps-3 col-12' style={{ display: "flex", flexDirection: "column", }}>
                                    <b className='text'>
                                        <Link className='hover-with-underline text' to={`/u/${post.user.username}`}>
                                            {post.user.firstName} {post.user.lastName}
                                        </Link>
                                    </b>
                                    <span style={{ fontSize: 12 }}>
                                        <Link className='hover-with-underline text' to={`/p/${post.uuid}`}>{moment(post.createdAt).fromNow()}</Link>
                                    </span>
                                </div>
                            </div>
                            <div className='col-1' style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', margin: 0 }} >
                                <Dropdown post={post} />
                            </div>
                        </div>
                        <div>
                            <p className='text mb-3' style={{ marginTop: 15, paddingLeft: 15, fontSize: 16, marginBottom: 5 }}>{post.body}</p>
                        </div>
                    </div >
                    {
                        post.imageUrl !== null &&
                        <div className="media hover" style={{ display: "flex", justifyContent: "center" }} onClick={() => handleImageClick(post)}>
                            <img alt='media' style={{ width: "100%", borderRadius: 10 }} src={post.imageUrl} />
                        </div>
                    }
                    < Comments fetchPosts={fetchPosts} post={post} />
                </div >
            ))}
            <ModalFeed userImage={userSlice.user.image} userId={userSlice.user.id} post={post} setPost={setPost} imageUrl={imageUrl} open={open} setopen={setopen} />
        </div>
    )
}

export default Feeds
