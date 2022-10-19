import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Header from '../components/header'
import { fetchCurrentUser } from '../redux/apiFetchs'
import SignUpScreen from "../screens/SignUpScreen"
import UserInfoScreen from '../screens/UserInfoScreen'
import { ThemeContex } from './ThemeContext'



const AuthContext = createContext()

export const AuthProvider = () => {
    const ethAddress = localStorage.getItem("ethAddress")
    const [isNewUser, setIsNewUser] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [feeds, setFeeds] = useState(false)
    const [viewMorChange, setViewMorChange] = useState(false)
    const { setTheme } = useContext(ThemeContex)
    const { userSlice } = useSelector(state => state)
    const dispatch = useDispatch()
    const [currentUser] = useState({
        "id": 2,
        "firstName": "Brayhan",
        "lastName": "De Aza",
        "uuid": "0x627201cE0F95355B7D94a6B3931B26FF08871AC5",
        "username": "1656269378233",
        "image": "http://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg",
        "theme": "light",
        "createdAt": "2022-06-26T18:49:38.338Z",
        "updatedAt": "2022-06-26T18:49:38.338Z"
    })

    const login = async (uuid) => {
        await axios.post("/users/login", { uuid }).then(data => {
            if (!data.data) {
                console.log(data.data)
                setIsNewUser(true)
                setTheme("light")
            }
        })
    }

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

    useEffect(() => {
        if (isAuthenticated && ethAddress) {
            dispatch(fetchCurrentUser(ethAddress))
            login(ethAddress)
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (JSON.stringify(userSlice.user) !== "{}") {
            fetchFeeds(userSlice.user.id)
        }
    }, [userSlice])

    useEffect(() => {
        if (ethAddress) {
            setIsAuthenticated(true)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ currentUser, feeds, setIsAuthenticated, viewMorChange, setViewMorChange }}>
            {isAuthenticated ?
                <div>
                    {isNewUser ? <UserInfoScreen /> :
                        <div>
                            <Outlet />
                        </div>}
                </div>
                : <SignUpScreen />}
        </AuthContext.Provider >
    )
}


export default AuthContext