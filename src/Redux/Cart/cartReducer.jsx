import {
    ALL_CART_REQUEST,
    ALL_CART_SUCCESS,
    ALL_CART_FAIL,
    POST_CART,
    POST_CART_SUCCESS,
    ADD_TO_CART,
    ORDER_POST_REQUEST,
    ORDER_GET_REQUEST,
    ORDER_REQUEST_SUCCESS,
    ORDER_GET_SUCCESS,
    DELETE_FROM_CART,
    ORDER_REQUEST_FAIL,
    CART_DETAIL_REQUEST,
    CART_DETAIL_SUCCESS,
} from './typeCart';

// export const orderReducer = (state = { orders: [], isLoad: true }, action) => {
//     const { type, payload } = action;
//     switch (type) {
//         case ORDER_POST_REQUEST:
//         case ORDER_GET_REQUEST:
//             return {
//                 ...state,
//                 isLoad: true,
//             };
//         case ORDER_GET_SUCCESS:
//             return {
//                 ...state,
//                 isLoad: false,
//                 orders: payload.orders,
//             };
//         case ORDER_REQUEST_SUCCESS:
//             return {
//                 isLoad: false,
//                 orders: payload.orders,
//             };
//         case ORDER_REQUEST_FAIL:
//             return {
//                 ...state,
//                 isLoad: false,
//                 error: payload.error,
//             };
//         default:
//             return state;
//     }
// };

export const cartReduce = (state = { cart: [], orders: [], number: 0, isLoad: true, status: false }, action) => {
    const { type, payload } = action;

    switch (type) {
        case DELETE_FROM_CART:
            return {
                ...state,
                isLoad: true,
                number: state.number - 1,
            };
            break;
        case POST_CART:
            return {
                ...state,
                isLoad: true,
            };
            break;
        case POST_CART_SUCCESS:
            return {
                isLoad: false,
                ...state,
                cart: payload.cart,
            };
            break;
        case ALL_CART_REQUEST:
            return {
                ...state,
                isLoad: true,
            };
            break;
        case ALL_CART_SUCCESS:
            return {
                ...state,
                isLoad: false,
                number: payload.cart.length,
            };
            break;

        case CART_DETAIL_SUCCESS:
            return {
                ...state,
                isLoad: false,
                cart: payload.cart,
            };
            break;
        case ALL_CART_FAIL:
            return {
                ...state,
                isLoad: false,
                error: payload.error,
            };
            break;
        case ADD_TO_CART:
            return {
                ...state,
                cart: [...state.cart, payload.newItem],
                number: state.number + 1,
            };
            break;
        case ORDER_POST_REQUEST:
        case ORDER_GET_REQUEST:
        case CART_DETAIL_REQUEST:
            return {
                ...state,
                isLoad: true,
            };
            break;
        case ORDER_GET_SUCCESS:
            return {
                ...state,
                isLoad: false,
                orders: payload.orders,
            };
            break;
        case ORDER_REQUEST_SUCCESS:
            return {
                isLoad: false,
                orders: payload.orders,
                cart: payload.cart,
            };
            break;
        case ORDER_REQUEST_FAIL:
            return {
                ...state,
                isLoad: false,
                error: payload.error,
            };
            break;
        default:
            return state;
    }
};
