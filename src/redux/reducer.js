import { addDays, format } from "date-fns"

const initState = {
    favouritesRooms: localStorage.getItem('favourites_rooms') == null 
        ? [] 
        : JSON.parse(localStorage.getItem('favourites_rooms')),
    favouritesServices: localStorage.getItem('favourites_services') == null 
        ? [] 
        : JSON.parse(localStorage.getItem('favourites_services')),
    avatar: localStorage.getItem('avatar') == null 
        ? '' 
        : JSON.parse(localStorage.getItem('avatar')),
    bookmarkRooms: localStorage.getItem('bookmark_rooms') == null
        ? []
        : JSON.parse(localStorage.getItem('bookmark_rooms')),
    roomTypes: localStorage.getItem('room_types') == null
        ? []
        : JSON.parse(localStorage.getItem('room_types')),
    services: localStorage.getItem('services') == null
        ? []
        : JSON.parse(localStorage.getItem('services')),
    checkinDate: localStorage.getItem('checkin_date') == null
        ? format(new Date(), "dd/MM/yyyy")
        : JSON.parse(localStorage.getItem('checkin_date')),
    checkoutDate: localStorage.getItem('checkout_date') == null
        ? format(addDays(new Date(), 2), "dd/MM/yyyy")
        : JSON.parse(localStorage.getItem('checkout_date')),
    progressStep: localStorage.getItem('progress_step') == null
        ? 0
        : JSON.parse(localStorage.getItem('progress_step')),
    totalAmount: localStorage.getItem('total_amount') == null
        ? 0
        : JSON.parse(localStorage.getItem('total_amount')),
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case 'favourites/addFavouriteRoom':
            localStorage.setItem('favourites_rooms', JSON.stringify(
                [
                    ...state.favouritesRooms,
                    action.payload,
                ]
            ))
            return {
                ...state,
                favouritesRooms: [
                    ...state.favouritesRooms,
                    action.payload,
                ]
            }
        case 'favourites/addFavouriteService':
            localStorage.setItem('favourites_services', JSON.stringify(
                [
                    ...state.favouritesServices,
                    action.payload,
                ]
            ))
            return {
                ...state,
                favouritesServices: [
                    ...state.favouritesServices,
                    action.payload,
                ]
            }
        case 'favourites/removeFavouriteRoom':
            const newFavouriteRooms = state.favouritesRooms.filter((favouriteRoom) => {
                return favouriteRoom.id !== action.payload;
            });
            
            localStorage.setItem('favourites_rooms', JSON.stringify(newFavouriteRooms));
            
            return {
                ...state,
                favouritesRooms: newFavouriteRooms,
            };
        case 'favourites/removeFavouriteService':
            const newFavouriteServices = state.favouritesServices.filter((favouriteService) => {
                return favouriteService.id !== action.payload;
            });
        
            localStorage.setItem('favourites_services', JSON.stringify(newFavouriteServices));
        
            return {
                ...state,
                favouritesServices: newFavouriteServices,
            };
        case 'avatar/addAvatar':
            localStorage.setItem('avatar', JSON.stringify(action.payload));

            return {
                ...state,
                avatar: action.payload,
            }
        case 'avatar/removeAvatar':
            localStorage.setItem('avatar', JSON.stringify(''));

            return {
                ...state,
                avatar: action.payload,
            }
        case 'room/bookmarkRoom':
            localStorage.setItem('bookmark_rooms', JSON.stringify([
                ...state.bookmarkRooms,
                action.payload,
            ]))
            return {
                ...state,
                bookmarkRooms: [
                    ...state.bookmarkRooms,
                    action.payload,
                ]    
            }
        case 'room/unmarkRoom':
            const newBookmarkRooms = state.bookmarkRooms.filter((bookmarkRoom) => {
                return bookmarkRoom.id !== action.payload;
            });
            
            localStorage.setItem('bookmark_rooms', JSON.stringify(newBookmarkRooms));
            
            return {
                ...state,
                bookmarkRooms: newBookmarkRooms,
            };
        case 'roomType/addRoomType':
            localStorage.setItem('room_types', JSON.stringify([
                ...state.roomTypes,
                action.payload,
            ]))
            return {
                ...state,
                roomTypes: [
                    ...state.roomTypes,
                    action.payload,
                ]    
            }
        case 'roomType/removeRoomType':
            const newRoomTypes = state.roomTypes.filter((roomType) => {
                return roomType.id !== action.payload;
            });
            
            localStorage.setItem('room_types', JSON.stringify(newRoomTypes));
            
            return {
                ...state,
                roomTypes: newRoomTypes,
            };
        case 'service/addService':
            localStorage.setItem('services', JSON.stringify([
                ...state.services,
                action.payload,
            ]))
            return {
                ...state,
                services: [
                    ...state.services,
                    action.payload,
                ]    
            }
        case 'service/removeService':
            const newServices = state.services.filter((service) => {
                return service.id !== action.payload;
            });
            
            localStorage.setItem('services', JSON.stringify(newServices));
            
            return {
                ...state,
                services: newServices,
            };
        case 'checkinDate/addCheckinDate':
            localStorage.setItem('checkin_date', JSON.stringify(action.payload))
            return {
                ...state,
                checkinDate: action.payload,   
            }
        case 'checkoutDate/addCheckoutDate':
            localStorage.setItem('checkout_date', JSON.stringify(action.payload))
            return {
                ...state,
                checkoutDate: action.payload,
            }
        case 'progressStep/nextProgressStep':
            localStorage.setItem('progress_step', JSON.stringify(action.payload))
            return {
                ...state,
                progressStep: action.payload,
            }
        case 'progressStep/prevProgressStep':
            localStorage.setItem('progress_step', JSON.stringify(action.payload))
            return {
                ...state,
                progressStep: action.payload,
            }
        case 'totalAmount/addTotalAmount':
            localStorage.setItem('total_amount', JSON.stringify(action.payload));

            return {
                ...state,
                totalAmount: action.payload,
            }
        case 'totalAmount/removeTotalAmount':
            localStorage.setItem('total_amount', JSON.stringify(''));

            return {
                ...state,
                totalAmount: action.payload,
            }
        default:
            return state;
    }
}

export default rootReducer;