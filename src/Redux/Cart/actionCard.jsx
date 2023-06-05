import {
    ALL_CART_REQUEST,
    ALL_CART_SUCCESS,
    ALL_CART_FAIL,
    POST_CART,
    POST_CART_SUCCESS,
    ADD_TO_CART,
    DELETE_FROM_CART,
    ORDER_POST_REQUEST,
    ORDER_GET_REQUEST,
    ORDER_REQUEST_SUCCESS,
    ORDER_GET_SUCCESS,
    ORDER_REQUEST_FAIL,
    CART_DETAIL_REQUEST,
    CART_DETAIL_SUCCESS,
} from './typeCart';
import axios from 'axios';
let server = '/api/v2/cart';

export const GetOrder = () => async (dispatch) => {
    dispatch({ type: ORDER_GET_REQUEST });
    const { data } = await axios.get(`${server}/order`).catch((err) =>
        dispatch({
            type: ORDER_REQUEST_FAIL,
            payload: {
                error: err.response ? err.response.data.message : 'update your order is fail!!',
            },
        }),
    );
    if (data && data.success) {
        dispatch({
            type: ORDER_GET_SUCCESS,
            payload: {
                orders: data.orders,
            },
        });
    }
};
export const OrderPost = (dataForm) => async (dispatch) => {
    dispatch({ type: ORDER_POST_REQUEST });

    const { data } = await axios.post(`${server}/order`, dataForm).catch((err) =>
        dispatch({
            type: ORDER_REQUEST_FAIL,
            payload: {
                error: err.response ? err.response.data.message : 'update your order is fail!!',
            },
        }),
    );

    if (data && data.success)
        dispatch({
            type: ORDER_REQUEST_SUCCESS,
            payload: {
                orders: data.orders,
                cart: data.cart,
            },
        });

    return data ? data.success : false;
};
export const AllCartRequest = () => async (dispatch) => {
    try {
        dispatch({
            type: ALL_CART_REQUEST,
        });
        const { data } = await axios.get(`${server}/all`);
        const { products } = data.data;
        // console.log(data);
        dispatch({
            type: ALL_CART_SUCCESS,
            payload: {
                cart: products,
            },
        });
    } catch (err) {
        dispatch({
            type: ALL_CART_FAIL,
            payload: {
                error: err.response.data.msg || 'Get all cart is fail',
            },
        });
    }
};
export const postCart = (cartState) => async (dispatch) => {
    try {
        dispatch({
            type: POST_CART,
        });
        const { data } = await axios.post(`${server}/add`, cartState);
        dispatch({
            type: POST_CART_SUCCESS,
            payload: {
                cart: data.cart,
            },
        });
    } catch (err) {
        dispatch({
            type: ALL_CART_FAIL,
            payload: {
                error: err.response.data.msg || 'Get all cart is fail',
            },
        });
    }
};
export const AddToCart = (productId, quantity) => async (dispatch, getState) => {
    const state = getState();
    const { cart } = state.cartReducer;
    const isCheck = cart.some((item) => item.productId === productId);

    if (isCheck) {
        alert('Sản phẩm đã có trong giỏ');
        return;
    } else {
        try {
            dispatch({
                type: ALL_CART_REQUEST,
            });
            const { data } = await axios.post(`${server}/add`, { productId, quantity });
            if (data.success) {
                dispatch({
                    type: ADD_TO_CART,
                    payload: {
                        newItem: { quantity, productId },
                    },
                });
            } else alert('Thêm sản phẩm không thành công');
        } catch (err) {
            console.log(err);
            dispatch({
                type: ALL_CART_FAIL,
                payload: {
                    error: err.response.data.msg || 'Post cart fail',
                },
            });
        }
    }

    // const { cart } = state.cartReducer;
};
export const SingleDeleteCart = (numId) => async (dispatch, getState) => {
    const state = getState();
    const { cart } = state.cartReducer;

    cart.forEach((item, index) => {
        if (item._id === numId) cart.splice(index, 1);
    });

    try {
        dispatch({
            type: POST_CART,
        });

        const { data } = await axios.delete(`${server}/delete`, {
            data: { productId: numId },
        });
        if (data.success)
            dispatch({
                type: DELETE_FROM_CART,
            });
    } catch (err) {
        dispatch({
            type: ALL_CART_FAIL,
            payload: {
                error: err.response.data.msg || 'Remove product fail',
            },
        });
    }
};
export const getDetailCart = () => async (dispatch) => {
    try {
        dispatch({
            type: CART_DETAIL_REQUEST,
        });
        const { data } = await axios.get(`${server}/detail`);
        dispatch({
            type: CART_DETAIL_SUCCESS,
            payload: {
                cart: data.data,
            },
        });
    } catch (err) {
        dispatch({
            type: ALL_CART_FAIL,
            payload: {
                error: err.response.data.error.message || 'Get all cart is fail',
            },
        });
    }
};
