const initialstate = {
    show: false,
    visibility: false,
    imageUrl: null,
    hasMedia: false,
    showImageModal: false,
    showImageModalData: "",
    feeds: []
}

const posts = (state = initialstate, action) => {
    switch (action.type) {
        case "SHOW_MODAL":
            return Object.assign({}, state, {
                show: true
            })
        case "HIDE_MODAL":
            return Object.assign({}, state, {
                show: false,
                visibility: true
            })
        case "SHOW_IMAGE_MODAL":
            return Object.assign({}, state, {
                showImageModal: true,
                showImageModalData: action.data
            })
        case "HIDE_IMAGE_MODAL":
            return Object.assign({}, state, {
                showImageModal: false,
                showImageModalData: ""
            })
        case "POST_IMAGE":
            return Object.assign({}, state, {
                show: true,
                imageUrl: action.data,
                visibility: false,
                hasMedia: true
            })
        case "FETCH_FEEDS":
            return Object.assign({}, state, {
                feeds: action.data
            })
        default:
            return state
    }
}

export default posts