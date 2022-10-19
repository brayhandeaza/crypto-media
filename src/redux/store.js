import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./slicers/userSlice"
import modalSlice from "./slicers/modalSlice"
import feedsSlice from "./slicers/feedsSlice"

export default configureStore({
    reducer: {
        userSlice,
        modalSlice,
        feedsSlice
    }
})