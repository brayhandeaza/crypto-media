import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios"


// fetch all user
export const fetchUsers = createAsyncThunk("user/fetchUsers", () => {
    return axios.get(`users`).then((res) => res.data)
})
// fetch all user
export const posthUsers = createAsyncThunk("user/posthUsers", ({ firstName, lastName, username, uuid, image, dob }) => {
    return axios.post(`users`, { firstName, lastName, username, uuid, image, dob }).then((res) => res.data)
})

// fetch all user
export const fetchCurrentUser = createAsyncThunk("user/fetchCurrentUser", (uuid) => {
    return axios.get(`users/f/${uuid}`).then((res) => res.data)
})

// ----------------------------- Login -----------------------------
export const loginUser = createAsyncThunk("user/loginUser", ({ firstName, lastName, username, uuid, image }) => {
    return axios.post("/users", { firstName, lastName, username, uuid, image }).then((res) => res.data)
})


// ----------------------------- Feed -----------------------------

// fetch feeds
export const fetchFeeds = createAsyncThunk("feed/fetchFeeds", (id) => {
    return axios.get(`posts/followers/${id}`).then((res) => {
        const sortDESC = (arr) => arr.sort((a, b) => b.id - a.id)
        let posts = []
        res.data.data.forEach(post => {
            posts.push(post.user.posts)
        })
        return sortDESC([].concat.apply([], posts))
    })
})

// fetch feeds
export const fetchFeed = createAsyncThunk("feed/fetchFeed", (uuid) => {
    return axios.get(`posts/single/${uuid}`).then((res) => res.data)
})

// post feed
export const postFeed = createAsyncThunk("feed/postFeed", ({ imageUrl, body, privacy, uuid, tokenCookie }) => {
    return axios.post(`posts/${uuid}`, {
        imageUrl, body, privacy
    }).then((res) => res.data)
})


// delete feed
export const deleteFeed = createAsyncThunk("feed/deleteFeed", (id) => {
    return axios.patch(`posts/${id}`, { hidden: true }).then((res) => res.data)
})


// unfallow user
export const unfallowUser = createAsyncThunk("feed/deleteFeed", ({ userId, followingId }) => {
    console.log({ userId, followingId });
    return axios.delete(`users/${userId}/following/${followingId}`, { hidden: true }).then((res) => res.data)
})


// --------------------- Comments ----
export const fetchCommentsPost = createAsyncThunk("comments/fetchComments", (postId, limit) => {
    return axios.get(`/comments/post/${postId}?limit=${limit}`).then((res) => res.data)
})

// await axios.get(`/comments/post/${props.post?.id}?limit=${limit}`).then((res) => {
//     if (!res.data.error) {
//         setComments(res.data.data?.rows)
//         setCount(res.data.data?.count)
//     }
// })