import { toast } from "react-toastify"

export const addFavouriteRoom = (data) => {
    toast.success('Successfully added to favorites rooms list.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })
    
    return {
        type: 'favourites/addFavouriteRoom',
        payload: data,
    }
}

export const addFavouriteService = (data) => {
    toast.success('Successfully added to favorites services list.!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })
    
    return {
        type: 'favourites/addFavouriteService',
        payload: data,
    }
}

export const removeFavouriteRoom = (data) => {
    toast.success('Successfully removed from favorites rooms list!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })

    return {
        type: 'favourites/removeFavouriteRoom',
        payload: data,
    }
}

export const removeFavouriteService = (data) => {
    toast.success('Successfully removed from favorites rooms list!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })

    return {
        type: 'favourites/removeFavouriteService',
        payload: data,
    }
}

export const addAvatar = (data) => {
    return {
        type: 'avatar/addAvatar',
        payload: data
    }
}

export const removeAvatar = (data) => {
    return {
        type: 'avatar/removeAvatar',
        payload: data
    }
}

export const bookmarkRoom = (data) => {
    toast.success('We\'ll keep your room for 30 minutes!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })

    return {
        type: 'room/bookmarkRoom',
        payload: data,
    }
}

export const unmarkRoom = (data) => {
    toast.success('Successfully unmark room!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })

    return {
        type: 'room/unmarkRoom',
        payload: data,
    }
}

export const addRoomTypes = (data) => {
    return {
        type: 'roomType/addRoomType',
        payload: data,
    }
}

export const removeRoomType = (data) => {
    return {
        type: 'roomType/removeRoomType',
        payload: data,
    }
}

export const addService = (data) => {
    return {
        type: 'service/addService',
        payload: data,
    }
}

export const removeService = (data) => {
    return {
        type: 'service/removeService',
        payload: data,
    }
}

export const addCheckinDate = (data) => {
    return {
        type: 'checkinDate/addCheckinDate',
        payload: data,
    }
}

export const addCheckoutDate = (data) => {
    return {
        type: 'checkoutDate/addCheckoutDate',
        payload: data,
    }
}

export const nextProgressStep = (data) => {
    return {
        type: 'progressStep/nextProgressStep',
        payload: data,
    }
}

export const prevProgressStep = (data) => {
    return {
        type: 'progressStep/prevProgressStep',
        payload: data,
    }
}

export const addTotalAmount = (data) => {
    return {
        type: 'totalAmount/addTotalAmount',
        payload: data,
    }
}

export const removeTotalAmount = (data) => {
    return {
        type: 'totalAmount/removeTotalAmount',
        payload: data,
    }
}
