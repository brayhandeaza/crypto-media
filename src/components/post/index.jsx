import React, { useState, useEffect } from 'react'
import { faMicrophone, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { show } from '../../redux/slicers/modalSlice'
import md5 from "md5"

const Post = () => {
    const [currentUser, setCurrentUser] = useState([])
    const dispatch = useDispatch()
    const userSlice = useSelector(state => state.userSlice)


    const handleOnClick = () => {
        dispatch(show())
    }

    useEffect(() => {
        if (JSON.stringify(userSlice.user) !== "{}") {
            setCurrentUser(userSlice.user)
        }
    }, [userSlice])

    return (
        <section className="Post mb-3 p-3 mt-3 background">
            <div aria-expanded="false" className='d-flex'>
                <div className='col-1 pt-1'>
                    {currentUser.image !== {} && <img alt="crypto" className='col-3' style={{ width: 40, height: 40, borderRadius: 100 }} src={currentUser.image} />}
                </div>
                <div className='col-10 ms-3' style={{ display: "flex", flexDirection: "column", height: 80, justifyContent: "space-between" }}>
                    <div onClick={handleOnClick} style={{ height: 40 }} className="form-control mb-0 mt-1 post hover" type="text" placeholder="Post something" aria-label="Post something" >
                        <span style={{ color: "gray", fontSize: 14, position: "relative", top: -3 }}>Post something</span>
                    </div>
                    <div className="post-options p-3" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Link to={`/lives/${md5(Date.now())}`} style={{ color: "black" }}>
                            <div className="live hover" style={{ display: "flex", alignItems: "center" }}>
                                <FontAwesomeIcon style={{ fontSize: 20, color: "#F0497C" }} icon={faVideo} />
                                <b className='ps-2 text'>Go Live</b>
                            </div>
                        </Link>
                        <Link to={`/debate/fbfgshgfjfgjhkj`} style={{ color: "black" }}>
                            <div className="live hover" style={{ display: "flex", alignItems: "center" }}>
                                <FontAwesomeIcon style={{ fontSize: 20, color: "#7196B5" }} icon={faMicrophone} />
                                <b className='ps-2 text'>Debate</b>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default Post