import { createSlice } from '@reduxjs/toolkit'


const modalSlice = createSlice({
    name: "modal",
    initialState: {
        show: false,
        commentMedia: false,
        edit: false,
        popover: false,
        payload: null
    },
    reducers: {
        show: (state) => {
            return { ...state, show: true }
        },
        hide: (state) => {
            return { ...state, show: false }
        },

        showCommentMedia: (state, action) => {
            return { ...state, commentMedia: true, payload: action.payload }
        },

        hideCommentMedia: (state) => {
            return { ...state, commentMedia: false }
        },

        showEdit: (state, action) => {
            return { ...state, edit: true, popover: false, payload: action.payload }
        },

        hideEdit: (state) => {
            return { ...state, edit: false, popover: true }
        },

        showPopover: (state, action) => {
            return { ...state, popover: true }
        },
        hidePopover: (state) => {
            return { ...state, popover: false }
        }
    }
})

export const { show, hide, showCommentMedia, hideCommentMedia, showEdit, hideEdit, showPopover, hidePopover } = modalSlice.actions

export default modalSlice.reducer




