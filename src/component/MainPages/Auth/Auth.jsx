import React, { useEffect } from "react";
import Signup from "../Form/Signup";
import Login from "../Form/Login";
import { redirect, useLocation, Navigate } from "react-router-dom";
// import Loading from "../utils/Loading/Loading2.js";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import setHeaderDefault from "../helpers/SetHeader";
import { ACCESSTOKEN } from "../../../Redux/Auth/typeAuth";
// import { SERVER } from "../helpers/key.js";
import { USER_VERIFY } from "../../../Redux/Auth/typeAuth";
import ResetPass from "../Form/ResetPass";

const Auth = ({ authRender: AuthRender }) => {
    let server = "http://localhost:8500";
    const { isLoad, isAuth } = useSelector((state) => state.userAuth);
    const dispatch = useDispatch();
    const location = useLocation();

    const loadUser = async () => {
        if (localStorage[ACCESSTOKEN]) {
            setHeaderDefault(localStorage[ACCESSTOKEN]);
        }

        try {
            const { data } = await axios.get(`${server}/user/info`);

            if (data.success) {
                dispatch({
                    type: USER_VERIFY,
                    payload: {
                        isAuth: true,
                        user: data.user,
                    },
                });
            }
        } catch (err) {
            localStorage.removeItem(ACCESSTOKEN);
            setHeaderDefault(null);
            dispatch({
                type: USER_VERIFY, //
                payload: {
                    isAuth: false, //
                    user: null,
                },
            });
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    let body;

    // if (isLoad) body = <Loading />;
    if (isAuth) {
        if (location.state) return <Navigate replace={true} to={`${location.state.from}`} />;
        return <Navigate replace={true} to="/" />;
    } else
        body = (
            <>
                {AuthRender === "login" && <Login />}
                {AuthRender === "signup" && <Signup />}
                {AuthRender === "forget" && <ResetPass type="email" />}
                {AuthRender === "reset" && <ResetPass type="reset" />}
            </>
        );
    return <>{body}</>;
};

export default Auth;
