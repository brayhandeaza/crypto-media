import { createSlice } from '@reduxjs/toolkit'
import { fetchUsers, fetchCurrentUser, loginUser, posthUsers } from "../apiFetchs"

const initialState = {
    users: [],
    user: {},
    error: '',
    loading: false
}

const userSlicer = createSlice({
    name: "users",
    initialState,
    extraReducers: {
        // create user
        [posthUsers.pending]: (state) => {
            state.loading = true
        },
        [posthUsers.fulfilled]: (state, action) => {
            window.location.reload()
            console.log(action.payload)
        },
        [posthUsers.rejected]: (state, action) => {
            state.loading = false
            state.users = []
            state.error = action.error.message
        },

        // login user
        [loginUser.pending]: (state) => {
            state.loading = true
        },
        [loginUser.fulfilled]: (state, action) => {
            state.loading = false
            state.users = action.payload
            state.error = ''
            console.log(action.payload)
        },
        [loginUser.rejected]: (state, action) => {
            state.loading = false
            state.users = []
            state.error = action.error.message
        },

        // fetch all users
        [fetchUsers.pending]: (state) => {
            state.loading = true
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.loading = false
            state.users = action.payload
            state.error = ''
        },
        [fetchUsers.rejected]: (state, action) => {
            state.loading = false
            state.users = []
            state.error = action.error.message
        },

        // fetch current user
        [fetchCurrentUser.fulfilled]: (state, action) => {
            state.loading = false
            state.user = action.payload.data ? action.payload.data : {}
            state.error = ''
        },
        [fetchCurrentUser.rejected]: (state, action) => {
            state.loading = false
            state.user = {}
            state.error = action.error.message
        },
        [fetchCurrentUser.pending]: (state) => {
            state.loading = true
        }
    }
})



export default userSlicer.reducer




