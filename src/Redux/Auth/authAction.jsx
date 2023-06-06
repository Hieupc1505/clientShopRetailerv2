import {
    USER_LOGIN_REQUEST,
    USER_AUTH_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    ACCESSTOKEN,
    USER_LOGOUT,
    USER_UPDATE_PROFILE,
    USER_UPLOAD_REQUEST,
    CLEAR_ERROR,
    USER_REQUEST,
    USER_UPLOAD_PROFILE,
    USER_FORGET_SENDEMAIL,
    USER_FORGET_RESET,
} from './typeAuth';
import axios from 'axios';
import setHeaderDefault from '../../component/MainPages/helpers/SetHeader';
axios.defaults.withCredentials = true;

const server = 'https://shopv2.onrender.com';

export const sendMailForget = (formData) => async (dispatch) => {
    dispatch({ type: USER_REQUEST });
    const { data } = await axios.post(`${server}/api/v2/auth/forget/account`, formData).catch((err) =>
        dispatch({
            type: USER_AUTH_FAIL,
            payload: {
                error: err.response.data.msg,
            },
        }),
    );
    dispatch({ type: USER_FORGET_SENDEMAIL });
    return data; //{message}
};

export const sendPassForget = (link, formData) => async (dispatch) => {
    dispatch({ type: USER_REQUEST });
    const { data } = await axios.post(`${server}/api/v2/auth/reset/account`, formData).catch((err) =>
        dispatch({
            type: USER_AUTH_FAIL,
            payload: {
                error: err.response.data.msg,
            },
        }),
    );
    dispatch({ type: USER_FORGET_RESET });
    return data; //{message}
};

export const updateProfile = (formUpdateData) => async (dispatch) => {
    dispatch({
        type: USER_REQUEST,
    });
    const { data } = await axios.post(`/user/update?_method=put`, formUpdateData).catch((err) =>
        dispatch({
            type: USER_AUTH_FAIL,
            payload: {
                error: err.response.data.msg || 'Update your profile fail!!',
            },
        }),
    );
    dispatch({
        type: USER_UPDATE_PROFILE,
        payload: {
            user: data.user,
        },
    });
};

export const clearError = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERROR,
    });
};

export const userLogin = (LoginFormData) => async (dispatch) => {
    try {
        const { data } = await axios.post(`${server}/api/v2/auth/login`, LoginFormData, {
            withCredentials: true,
        });

        if (data.success) {
            localStorage.setItem(ACCESSTOKEN, data.accessToken);
        }

        // await loadUser();

        return data;
    } catch (err) {
        dispatch({
            type: USER_AUTH_FAIL,
            payload: {
                error: err.response.data?.error.message || 'Đăng nhập không thành công!!',
            },
        });
    }
};
export const userLogin2 = (str) => async (dispatch) => {
    try {
        const { data } = await axios.get(`${server}/api/v2/auth/${str}`);

        if (data.success) {
            localStorage.setItem(ACCESSTOKEN, data.accessToken);
        }

        // await loadUser();

        return data;
    } catch (err) {
        dispatch({
            type: USER_AUTH_FAIL,
            payload: {
                error: err.response.data?.error.message || 'Đăng nhập không thành công!!',
            },
        });
    }
};

export const userRegister = (RegisterFormData) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });
        const { data } = await axios.post(`${server}/api/v2/auth/register`, RegisterFormData);
        dispatch({
            type: USER_REGISTER_SUCCESS,
        });

        return data;
    } catch (err) {
        dispatch({
            type: USER_AUTH_FAIL,
            payload: {
                error: err.response ? err.response.data.msg : 'Register fail!!',
            },
        });
    }
};
export const userLogout = () => async (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST });
    const { data } = await axios.get(`${server}/api/v2/auth/logout`);
    localStorage.removeItem(ACCESSTOKEN);
    setHeaderDefault(null);
    dispatch({ type: USER_LOGOUT });
};

export const sendProfileForm = (userInfo) => async (dispatch) => {
    try {
        dispatch({
            type: USER_UPLOAD_REQUEST,
        });

        const { data } = await axios.post(`/user/save/profile`, userInfo);

        dispatch({
            type: USER_UPLOAD_PROFILE,
            payload: {
                user: data.newUser,
            },
        });
    } catch (err) {
        dispatch({
            type: USER_AUTH_FAIL,
            payload: {
                error: err.response ? err.response.data.msg : 'Update your profile fail!!',
            },
        });
    }
};
