import { createSlice } from '@reduxjs/toolkit'
import { fetchFeed, postFeed, unfallowUser, fetchCommentsPost, fetchFeeds } from "../apiFetchs"

const initialState = {
    feeds: [],
    feed: {},
    comments: [],
    error: '',
    loading: false
}

const feedsSlice = createSlice({
    name: "feeds",
    initialState,
    extraReducers: {


        // fetch feeds
        [fetchFeeds.pending]: (state) => {
            state.loading = true
        },
        [fetchFeeds.fulfilled]: (state, action) => {
            state.loading = false
            state.feeds = action.payload
            state.error = ''
        },
        [fetchFeeds.rejected]: (state, action) => {
            state.loading = false
            state.feeds = {}
            state.error = action.error.message
        },

        // fetch single feed
        [fetchFeed.pending]: (state) => {
            state.loading = true
        },
        [fetchFeed.fulfilled]: (state, action) => {
            state.loading = false
            state.feed = action.payload
            state.error = ''
        },
        [fetchFeed.rejected]: (state, action) => {
            state.loading = false
            state.feeds = {}
            state.error = action.error.message
        },

        // post feed
        [postFeed.pending]: (state, action) => {
            state.loading = true
        },
        [postFeed.fulfilled]: (state, action) => {
            state.loading = false
            state.feeds = action.payload
            state.error = ''
            window.location.reload()
        },
        [postFeed.rejected]: (state, action) => {
            state.loading = false
            state.feeds = []
            state.error = action.error.message
        },

        // unfollowing user
        [unfallowUser.pending]: (state, action) => {
            state.loading = true
        },
        [unfallowUser.fulfilled]: (state, action) => {
            state.loading = false
            state.error = ''
            window.location.reload()
        },
        [unfallowUser.rejected]: (state, action) => {
            state.loading = false
            state.feeds = []
            state.error = action.error.message
        },

        // fetch comments
        [fetchCommentsPost.pending]: (state, action) => {
            state.loading = true
            console.log(action);
        },
        [fetchCommentsPost.fulfilled]: (state, action) => {
            state.loading = false
            state.error = ''
            state.comments = action.payload
        },
        [fetchCommentsPost.rejected]: (state, action) => {
            state.loading = false
            state.comments = []
            state.error = action.error.message
            console.log(action);
        }
    }
})



export default feedsSlice.reducer




