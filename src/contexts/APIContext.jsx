import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Header from '../components/header'
import { fetchCurrentUser } from '../redux/apiFetchs'
import SignUpScreen from "../screens/SignUpScreen"
import UserInfoScreen from '../screens/UserInfoScreen'
import { ThemeContex } from './ThemeContext'


export const APIContext = createContext()

const APIProvider = () => {
    const state = useSelector(state => state)
    const [feeds, setFeeds] = useState(false)

    const fetchFeeds = async (id) => {
        await axios.get(`posts/followers/${id}`).then((res) => {
            const sortDESC = (arr) => arr.sort((a, b) => b.id - a.id)
            let posts = []
            res.data.data.forEach(post => {
                posts.push(post.user.posts)
            })
            const _feeds = sortDESC([].concat.apply([], posts))
            setFeeds(_feeds)
        })
    }

    return (
        <APIContext.Provider value={{ feeds}}>
            <Outlet />
        </APIContext.Provider >
    )
}


export default APIProvider