import React, { useEffect, useState, useLayoutEffect } from 'react';
// import { Link, useHistory, useLocation } from "react-router-dom";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../../Redux/Auth/authAction';
import { AllCartRequest } from '../../Redux/Cart/actionCard';
import { searchProduct } from '../../Redux/ProductRedux/actionProduct';
import { v4 as uuid4 } from 'uuid';
import logoImage from '../../../public/public/img/o6.png';

import appStore from '/public/img/appStore.png';
import ggPlay from '/public/img/ggplay.png';

const Header = () => {
    // let { pathname } = useLocation();
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const { isAuth, user, isLoad, ref } = useSelector((state) => state.userAuth);
    const { number } = useSelector((state) => state.cartReducer);
    // const [flag, setFlag] = useState(false);
    let location = useLocation();
    useEffect(() => {
        if (isAuth) dispatch(AllCartRequest());
    }, [isAuth]);

    const onLogOut = async () => {
        clearInterval(ref);
        await dispatch(userLogout());
        // history.push("/");
        navigate('/home');
    };

    const [valInput, setValInput] = useState('');
    const [store, setStore] = useState([]);

    const handleChangeInput = async (e) => {
        const text = e.target.value;
        setValInput(text);
        if (text !== '' && text.length >= 2) {
            let { data } = await dispatch(searchProduct(text));
            setStore(data);
        } else if (text === '') setStore([]);
        else return;
    };

    const addLocalString = (text) => {
        text = text.trim();
        let oldArr = [];
        let local = localStorage.getItem('search');
        if (local) {
            let data = JSON.parse(local);
            let check = data.indexOf(text);
            if (check === -1) oldArr = [text, ...data];
            else {
                oldArr = [text, ...data.slice(0, check), ...data.slice(check + 1)];
            }
        } else {
            oldArr.push(text);
        }
        const arr = JSON.stringify(oldArr);
        localStorage.setItem('search', arr);
    };

    const handleDangNhap = () => {
        navigate('/login', { state: { from: location.path } });
    };

    const LoadPageSearch = (text = null) => {
        addLocalString(text || valInput);
        document.querySelector('input').blur();

        navigate(`/page/search?key=${text || valInput}`);
    };
    const handleClickSearch = () => {
        if (valInput) LoadPageSearch();
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const list = e.target.parentElement.querySelector('ul');
        list.classList.remove('show-list');
        valInput && LoadPageSearch();
    };
    const handleClickItemSearch = async (text) => {
        // setValInput(name);
        // if (name) addLocalStore();
        LoadPageSearch(text);
        setValInput(text);

        const list = document.querySelector('.header_list-search');
        list.classList.remove('d-block');
    };

    useEffect(() => {
        const searchInput = document.querySelector('.header_body-search-input');
        const list = document.querySelector('.header_list-search');
        searchInput.addEventListener('focus', () => {
            list.classList.add('show-list');
        });
        searchInput.addEventListener('blur', () => {
            list.classList.remove('show-list');
        });

        list.addEventListener('mouseover', () => {
            list.classList.replace('show-list', 'd-block');
        });
        list.addEventListener('mouseleave', () => {
            list.classList.replace('d-block', 'show-list');
        });
    }, []);

    useEffect(() => {
        const listNoti = document.querySelector('.header_notifi-eff');
        listNoti.parentElement.addEventListener('mouseenter', () => {
            listNoti.style.animation = 'fade-in linear 0.2s forwards';
        });
        listNoti.parentElement.addEventListener('mouseleave', () => {
            listNoti.style.animation = 'fade-out linear 0.2s forwards';
        });
    }, [isAuth]);

    let style =
        store.length > 0
            ? {
                  border: '1px solid #d6cece9c',
                  boxShadow: '0 0 4px 1px #d7d0d09e',
              }
            : {};

    let local = localStorage.getItem('search');
    let arrOld = local ? JSON.parse(local) : [];

    return (
        <header>
            <div className="app grid wide">
                <div className="header_nav">
                    {/* <!--mt-2 here have a error --> */}
                    <ul className="header-nav-list header_nav-left ms-0 mt-2 mb-2">
                        <li
                            className="
                                header_nav-item
                                show
                                me-4
                                text-white
                                position-relative
                            "
                        >
                            <Link to="#" className="header_nav-link header_nav-link-download">
                                Tải ứng dụng
                            </Link>
                            <div
                                className="
                                    header_nav-app
                                    rounded
                                    bridge bridge-left bridge-custom-download
                                "
                            >
                                <div
                                    className="header_nav-app-qrcode w-100 rounded"
                                    style={{
                                        backgroundImage: "url('./public/img/qrcode.png')",
                                    }}
                                ></div>
                                <div className="header_nav-app-wrap">
                                    <img className="header_nav-link" src={appStore} alt="appstore" />
                                    <img className="header_nav-link" src={ggPlay} alt="ggplay" />
                                </div>
                            </div>
                        </li>
                        <li
                            className="
                                header_nav-item header_nav-item-not-effect
                                me-4
                                text-white
                                seperate
                            "
                        >
                            <span>Kết nối</span>
                            <i
                                className="
                                    header_nav-icons
                                    mx-1
                                    fab
                                    fa-facebook
                                    cursor-pointer
                                    mx-2
                                "
                            ></i>
                            <i
                                className="
                                    header_nav-icons
                                    me-1
                                    fab
                                    fa-instagram
                                    cursor-pointer
                                "
                            ></i>
                        </li>
                    </ul>
                    <ul
                        className="
                            header-nav-list header_nav-right
                            ms-0
                            mt-2
                            mb-2
                            rounded
                        
                            
                        "
                    >
                        {/* has user add class : use-user */}
                        <li
                            className="
                                header_nav-item
                                header_nav-item-show
                                me-4
                                text-white
                                position-relative
                            "
                        >
                            {/* <!-- header_nav-item-notifi  to show when not produces --> */}
                            <Link to="#" className="header_nav-link">
                                <i className="header_nav-icons me-1 far fa-bell"></i>
                                Thông báo
                            </Link>
                            {!user && (
                                <ul
                                    className="
                                    header_nav-notifi header_notifi-eff header_nav-notifi-has
                                    arrow-top
                                    rounded
                                    bridge bridge-right bridge-custom-notifi
                                    cursor-pointer
                                "
                                >
                                    <div className="header_nav-notify-not-produces">
                                        <img src="./public/img/99e561e3944805a023e87a81d4869600.png" alt="" />
                                        <span className="text-muted d-block mt-2">Đăng nhập để xem thông báo</span>
                                    </div>

                                    <div className="header_nav-auth d-flex use-user">
                                        {/* case has user add class : use-use */}
                                        <Link
                                            to="/signup"
                                            className="
                                            header_nav-auth-btn
                                            btn btn-light
                                            flex-fill
                                            rounded-0
                                            border-0
                                            d-block
                                        "
                                        >
                                            Đăng ký
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="
                                            header_nav-auth-btn
                                            btn btn-light
                                            flex-fill
                                            rounded-0
                                            border-0
                                            d-block
                                        "
                                        >
                                            Đăng nhập
                                        </Link>
                                    </div>
                                </ul>
                            )}
                            {user && (
                                <ul className="header_notifi-list header_notifi-eff arrow-top rounded bridge bridge-right bridge-custom-notifi">
                                    <h2 className="text-muted fs-6 p-2 fw-normal mb-0">Thông báo mới nhận</h2>
                                    <li className="header_notifi-list-item active">
                                        <Link
                                            to="#"
                                            className="
                                            header_notifi-list-link
                                            d-flex
                                            align-items-center
                                            text-decoration-none
                                        "
                                        >
                                            <img
                                                className="mx-2 header_notifi-list-img"
                                                height="30px"
                                                width="30px"
                                                src="https://www.pngkey.com/png/detail/357-3576955_06-nov-2018-login-successful.png"
                                                alt=""
                                            />

                                            <div
                                                className="
                                                header_notifi-list-wrap
                                                flex-fill
                                            "
                                            >
                                                <h5
                                                    className="
                                                    header-notifi-list-title
                                                    mb-0
                                                    fs-6
                                                    text-secondary
                                                "
                                                >
                                                    Tài khoản đã được xác thực
                                                </h5>
                                                <span
                                                    className="
                                                    header_notifi-list-text
                                                    text-muted
                                                    small
                                                "
                                                >
                                                    Tài khoản của bạn đã được kích hoạt. Now! Cùng khám đừng phá một
                                                    vòng web nào. Mọt ý kiến chỉ trích xin gửi về đồn công an gần nhà
                                                    bạn nhất
                                                </span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li>
                                        <button className="btn btn-sm btn-light text-secondary text-center w-100">
                                            Xem tất cả
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="header_nav-item me-4 text-white">
                            <Link to="#" className="header_nav-link">
                                <i
                                    className="
                                        header_nav-icons
                                        me-1
                                        far
                                        fa-question-circle
                                    "
                                ></i>
                                Hỗ trợ
                            </Link>
                        </li>

                        {isAuth === false && (
                            <>
                                <li className="header_nav-item header_nav-item-auth me-4 text-white">
                                    <Link to="/signup" className="header_nav-link">
                                        Đăng Ký
                                    </Link>
                                </li>
                                <li className="header_nav-item header_nav-item-auth me-4 text-white seperate">
                                    <span onClick={handleDangNhap} to="#" className="header_nav-link">
                                        Đăng Nhập
                                    </span>
                                </li>
                            </>
                        )}
                        {isAuth === true && (
                            <li className="header_nav-item header_nav-auth-account d-flex justify-content-center align-items-center position-relative">
                                <span
                                    className="header_nav-auth-account-img me-2"
                                    style={
                                        !!user.userInfo?.avatar?.path
                                            ? {
                                                  backgroundImage: `url('${user?.userInfo.avatar.path}')`,
                                              }
                                            : {
                                                  backgroundImage: `url('https://res.cloudinary.com/develope-app/image/upload/v1626161751/images_j0qqj4.png')`,
                                              }
                                    }
                                ></span>
                                <span className="header_nav-auth-account-name text-white">
                                    {user.userInfo?.userName
                                        ? user.userInfo.userName
                                        : `user${Math.floor(Math.random() * 300)}`}
                                </span>
                                <div className="header_nav-account-options dropdown-menu bridge arrow-top">
                                    <Link to="/add/profile" className="text-decoration-none">
                                        <div className="dropdown-item cursor-pointer">Tài khoản của tôi</div>
                                    </Link>
                                    <div className="dropdown-item cursor-pointer">
                                        <Link className="text-decoration-none text-secondary" to="/orders/status">
                                            Đơn mua
                                        </Link>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <div onClick={() => onLogOut()} className="dropdown-item cursor-pointer">
                                        {/* <Link
                                            className="text-decoration-none text-muted"
                                            to="/logout"
                                        >
                                            Đăng xuất
                                        </Link> */}
                                        Đăng xuất
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
                <div
                    className="
                        header_body
                        d-flex
                        justify-content-between
                        align-items-center
                    "
                >
                    <div className="header_body-logo">
                        <Link className="text-decoration-none" to="/home" alt="">
                            <img src={logoImage} alt="fshop" width="160px" height="150px" />
                        </Link>
                    </div>
                    {/* <form  name="search" onSubmit={handleSubmit}> */}
                    <div className="header_body-search flex-fill mx-5 border rounded">
                        <form
                            className="form-search d-flex align-items-center"
                            name="search_form"
                            onSubmit={handleSubmit}
                        >
                            <input
                                type="text"
                                className="
                                header_body-search-input
                                d-block
                                bg-transparent
                                ps-2
                                fs-6
                                text-dark
                                py-2
                            "
                                value={valInput}
                                onChange={handleChangeInput}
                                placeholder="Vd: hot gril xx"
                            />
                        </form>
                        <i className="fas fa-search search-product fs-6 rounded" onClick={handleClickSearch}></i>
                        <ul className="header_list-search" style={style}>
                            {store.length !== 0 &&
                                store.map((item) => (
                                    <li
                                        key={uuid4()}
                                        className="header_list-search-item"
                                        onClick={() => handleClickItemSearch(item)}
                                    >
                                        {item}
                                    </li>
                                ))}
                            {arrOld !== 0 &&
                                arrOld.map((item) => (
                                    <li
                                        key={uuid4()}
                                        className="header_list-search-item"
                                        onClick={() => handleClickItemSearch(item)}
                                    >
                                        <i className="fas fa-history text-muted"></i> {item}
                                    </li>
                                ))}
                        </ul>
                    </div>
                    {/* </form> */}
                    <div
                        className="
                            header_body-cart
                            l-1
                            cursor-pointer
                        "
                    >
                        <Link to="/products/cart" className="d-inline-block p-1 pe-0">
                            <i className="fas fa-shopping-cart text-white fs-5"></i>
                            {isAuth && number > 0 && (
                                <span className="badge badge-danger text-decoration-none">{number}</span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
