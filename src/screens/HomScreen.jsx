import React, { useEffect } from 'react'
import OurToken from '../components/ourToken'
import TopCoins from '../components/TopCoins'
import Post from '../components/post'
import Modal from '../components/post/modal'
import Feeds from '../components/post/feed'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeeds } from '../redux/apiFetchs'
import Header from '../components/header'

const HomScreen = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(fetchFeeds(1))
    // }, [])

    return (
        <div className="Home ps-5">
            <div className="container">
                <div className="row">
                    <div className="col-3" style={{ height: 500, padding: 0, marginRight: 7 }}>
                        <OurToken />
                        <TopCoins />
                    </div>
                    <div className="col-6 ps-2" style={{ height: 500, padding: 0 }}>
                        <div className="scroll">
                            <Post />
                            <Feeds />
                        </div>
                    </div>
                </div>
            </div>
            <Modal />
        </div>
    );
}

export default HomScreen;
