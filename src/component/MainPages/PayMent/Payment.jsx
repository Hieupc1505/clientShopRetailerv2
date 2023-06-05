import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../../public/css/pay.css';
import { v4 as uuid4 } from 'uuid';
import handleNum from '../helpers/handleNum';
import { useDispatch, useSelector } from 'react-redux';
import { sendProfileForm } from '../../../Redux/Auth/authAction';
import { updateProfile } from '../../../Redux/Auth/authAction';
import { useNavigate } from 'react-router-dom';
// import NotFound from "../utils/NotFound/NotFound";
import Loading2 from '../utils/Loading/Loading2';
// import { SERVER } from "../helpers/key";
import axios from 'axios';
import { OrderPost, postCart } from '../../../Redux/Cart/actionCard';
import Authorization from '../Auth/Authorization';

import address2 from '../helpers/address2';

const Payment = () => {
    const dispatch = useDispatch();
    const { search, state } = useLocation();
    const navigate = useNavigate();
    const [store, setStore] = useState({
        name: '',
        number: '',
        address: '',
        notes: '',
        focus: false,
    });
    const [data, setData] = useState([]);
    const [flag, setFlag] = useState([false, false, false]);
    const { number, name, address, notes } = store;
    const ele = React.createRef();
    const [done, setDone] = useState(false);
    const [typeShip, setTypeShip] = useState([true, false]);

    // const [param, setParam] = useState(null);

    const { user, isLoad: loadUser } = useSelector((state) => state.userAuth);
    const { isLoad } = useSelector((state) => state.cartReducer);
    const { order } = state;

    const totalCost = () => {
        let total = 0;

        Array.isArray(order) &&
            order.forEach((item) => {
                total += item.price * item.quantity;
            });
        return total;
    };

    const handleChangeInput = (e) => {
        setStore(() => ({
            ...store,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        setData(address2);
    }, []);

    useEffect(() => {
        let ipTop = document.querySelectorAll('input.text-to-top'); //eff
        let textTop = document.querySelectorAll('.form-text-top'); // topcd

        Array.from(ipTop).map((eff) => {
            eff.addEventListener('focus', () => {
                if (eff.value === '') eff.previousElementSibling.style.animation = 'fade-up linear 0.2s forwards';

                eff.previousElementSibling.style.color = '#0d6efd';
            });

            eff.addEventListener('blur', () => {
                // let ele = eff.previousElementSibling.
                // topcd = document.querySelector(".form-text-top");
                let topcd = eff.previousElementSibling;
                topcd.setAttribute('style', 'color : #6c757d !important');
                if (eff.value === '') {
                    topcd.style.animation = '';
                    topcd.classList.remove('after-effect');
                } else if (eff.value !== '') {
                    topcd.classList.add('after-effect');
                }
            });
        });
        Array.from(textTop).map((topcd) => {
            let eff = topcd.nextElementSibling;
            topcd.addEventListener('click', () => {
                eff.focus();
            });
        });

        ele.current.addEventListener('focus', function () {
            if (this.value === '') this.previousElementSibling.style.animation = 'fade-up linear 0.2s forwards';

            this.previousElementSibling.style.color = '#0d6efd';
        });
        ele.current.addEventListener('blur', function () {
            this.previousElementSibling.style.color = '#6c757d';
        });
    }, []);

    const handleItemClick = (e, index, current) => {
        const value = e.target.textContent;
        const lv = `level${current + 2}s`;

        current < 2 && setData(() => data[index][lv]);
        setStore(() => ({
            ...store,
            address: flag[0] === true ? `${value}` : `${address} - ${value}`,
        }));
        setFlag(() => flag.map((item, index) => (index === current + 1 && true) || false));
    };

    const handleInputAddressFocus = (e) => {
        setData(address2);
        setFlag(() => [true, false, false]);
    };
    const handleInputBlur = (e) => {
        setStore(() => ({ ...store, focus: true }));
    };

    const RenderAddress = (current) => {
        return data.map((item, index) => (
            <li
                className="list-group-item list-group-item-effect"
                key={uuid4()}
                onClick={(e) => handleItemClick(e, index, current)}
            >
                {item.name}
            </li>
        ));
    };
    useEffect(() => {
        setDone(!!user?.userInfo?.address);
    }, [user]);
    const completeFillInfo = (e) => {
        e.preventDefault();
        setDone(true);
    };
    const hashProduct = () => {
        const arr = JSON.stringify(
            order.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        );
        return btoa(arr);
    };
    const handleOrder = async (e) => {
        e.preventDefault();
        const type = typeShip[0] ? 'cod' : 'banking';

        const { data } = await axios.post(`/api/v2/cart/payment/${type}`, {
            productId: hashProduct(),
            address,
            number: +number,
            amount: totalCost(),
            bankCode: 'NCB',
            language: 'vn',
            shipping: 15000,
            notes,
            status: 0,
            type,
            pay: 'pending',
            weight: 450,
            name,
        });
        if (data.success && type === 'banking') return (window.location.href = data.url);
        if (data.success && type === 'cod') navigate('/home');
    };

    const changeCheck = (index) => {
        setTypeShip(typeShip.map((it, id) => (id === index && true) || false));
    };

    // if (!isLoad && !Loading && pros.length === 0) navigate("/");
    return (
        <>
            {!isLoad ? (
                <div className="app grid wide bg-light">
                    {done === false && (
                        <div
                            className="dialog-address position-fixed w-100 h-100"
                            style={{
                                zIndex: '10',
                                top: '0',
                                left: '0',
                                right: '0',
                                bottom: '0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'rgba(255, 255, 255, 0.9)',
                            }}
                        >
                            <div className="dialog-main rounded border bg-white">
                                {/* submit form */}
                                <form action="#" className="form p-4" name="addr">
                                    <div className="d-flex">
                                        <div className="form-group me-1">
                                            <div className="form-text-top px-1">Name</div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="Name"
                                                className="form-control-custom text-to-top"
                                                value={name}
                                                onChange={handleChangeInput}
                                            />
                                            <span className="email-err form-err"></span>
                                        </div>
                                        <div className="form-group ms-1">
                                            <div className="form-text-top px-1">Số điện thoại</div>
                                            <input
                                                type="text"
                                                name="number"
                                                id="number"
                                                className="form-control-custom text-to-top "
                                                value={number}
                                                onChange={handleChangeInput}
                                            />
                                            <span className="email-err form-err"></span>
                                        </div>
                                    </div>
                                    <div className="form-add-wrap mt-3">
                                        <div className="form-group">
                                            <div className="form-text-top px-1">Địa Chỉ</div>
                                            <input
                                                className="form-control-custom w-100 input-address"
                                                type="text"
                                                name="address"
                                                id="address"
                                                ref={ele}
                                                value={address}
                                                onChange={handleChangeInput}
                                                autoComplete="off"
                                                readOnly
                                                onFocus={handleInputAddressFocus}
                                                onBlur={handleInputBlur}
                                            />
                                            {store.focus && address === '' && (
                                                <span className="email-err form-err">Vui lòng nhập địa chỉ</span>
                                            )}
                                        </div>
                                        {1 === 1 && (
                                            <div className="form-add-list border rounded mt-3">
                                                <div
                                                    className="
                                        form-add-nav
                                        nav nav-pills nav-fill
                                        border-bottom
                                    "
                                                >
                                                    <div
                                                        className="nav-item nav-item-province  btn active rounded-0"
                                                        // onClick="loadData()"
                                                    >
                                                        Tỉnh/Thành phố
                                                    </div>
                                                    <div className="nav-item nav-item-district btn active">
                                                        Quận/Huyện
                                                    </div>
                                                    <div className="nav-item nav-item-ppc btn">Xã/Phường</div>
                                                </div>
                                                <ul className="list-group list-group-flush">
                                                    {flag[0] === true && RenderAddress(0)}
                                                    {flag[1] === true && RenderAddress(1)}
                                                    {flag[2] === true && RenderAddress(2)}

                                                    {/* {lev2 !== -1 &&
                                                        lev3 === -1 &&
                                                        data.map((item, index) => (
                                                            <li
                                                                className="list-group-item list-group-item-effect"
                                                                key={uuid4()}
                                                                onClick={(e) => handleItemClickLev2(e, index)}
                                                            >
                                                                {item.name}
                                                            </li>
                                                        ))}
                                                    {lev3 !== -1 &&
                                                        data.map((item, index) => (
                                                            <li
                                                                className="list-group-item list-group-item-effect"
                                                                key={uuid4()}
                                                                onClick={(e) => handleItemClickLev3(e, index)}
                                                            >
                                                                {item.name}
                                                            </li>
                                                        ))} */}
                                                </ul>
                                                <ul
                                                    className="
                                        list-group list-group-flush
                                        group-add2
                                    "
                                                ></ul>
                                            </div>
                                        )}
                                    </div>
                                    <textarea
                                        className="form-more-detail-addr mt-3 border rounded"
                                        placeholder="Địa chỉ cụ thể"
                                        name="notes"
                                        value={notes}
                                        onChange={handleChangeInput}
                                        style={{ minHeight: '150px' }}
                                    ></textarea>
                                    <div className="form-group mt-3">
                                        <label htmlFor="#" className="d-block">
                                            Loại địa chỉ
                                        </label>
                                        <div className="btn btn-outline-success me-2">
                                            Nhà riêng
                                            {/* <span className="flag-btn"></span> */}
                                        </div>
                                        <div className="btn btn-outline-success">Văn phòng</div>
                                    </div>
                                    <div className="justify-content-end mt-4 text-right d-flex">
                                        {!!user?.userInfo?.address && (
                                            <div
                                                className="
                                    btn btn-outline-secondary me-2
                                "
                                                onClick={() => setDone(!done)}
                                            >
                                                Trở lại
                                            </div>
                                        )}
                                        <button type="submit" onClick={completeFillInfo} className="btn btn-primary">
                                            Hoàn thành
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="pay-ment">
                        <div
                            className="
                        pay-address
                        mt-5
                        bg-white
                        border
                        rounded
                        position-relative
                    "
                            style={{ position: 'absolute', width: '100%' }}
                        >
                            <div className="draw position-absolute w-100"></div>
                            <h3 className="fs-5 mt-2 ms-4 text-info pt-2">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                Địa chỉ nhận hàng
                            </h3>
                            {1 === 1 && (
                                <ul className="pay-list d-flex justify-content-between me-5">
                                    <li
                                        className="pay-list-item fs-6 fw-bold"
                                        style={{
                                            /* width: 360px; */
                                            flexBasis: '35%',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            /* flex-grow: 11; */
                                        }}
                                    >
                                        <span className="pay-name me-2">{name}</span>
                                        <span className="pay-number">{number}</span>
                                    </li>
                                    <li className="pay-list-item px-2 flex-fill">{address}</li>
                                    <li className="pay-list-item text-muted" style={{ flexBasis: '10%' }}>
                                        Mặc định
                                    </li>
                                    <li
                                        className="pay-list-item cursor-pointer"
                                        style={{ flexBasis: '10%' }}
                                        onClick={() => setDone(!done)}
                                    >
                                        Thay đổi
                                    </li>
                                </ul>
                            )}
                        </div>
                        <div className="pay-ment-payrol card mt-5">
                            <div className="card-body py-4">
                                <nav
                                    className="
                                nav
                                d-flex
                                px-4
                                py-2
                                bg-white
                                border
                                rounded
                                border-bottom-0
                            "
                                >
                                    <li
                                        className="
                                    nav-item
                                    d-flex
                                    align-items-center
                                    flex-fill
                                "
                                    >
                                        <label className="nav-link ps-2 text-dark-60" htmlFor="all">
                                            Sản phẩm
                                        </label>
                                    </li>
                                    <li className="nav-item w-20 ms-auto l-2">
                                        <Link
                                            className="nav-link disabled ps-0"
                                            to="#"
                                            tabIndex="-1"
                                            aria-disabled="true"
                                        >
                                            Đơn Giá
                                        </Link>
                                    </li>
                                    <li className="nav-item l-2">
                                        <Link
                                            className="nav-link disabled ps-0"
                                            to="#"
                                            tabIndex="-1"
                                            aria-disabled="true"
                                        >
                                            Số Lượng
                                        </Link>
                                    </li>
                                    <li className="nav-item l-2">
                                        <Link
                                            className="nav-link disabled ps-0"
                                            to="#"
                                            tabIndex="-1"
                                            aria-disabled="true"
                                        >
                                            Số Tiền
                                        </Link>
                                    </li>
                                </nav>
                                {order.length > 0 &&
                                    order.map((item, index) => (
                                        <div key={uuid4()} className="card-list">
                                            <div
                                                key={uuid4()}
                                                className="
                                                px-4
                                                d-flex
                                                card-body
                                                bg-white
                                                border
                                                rounded
                                            "
                                            >
                                                <div
                                                    className="
                                            product-desc
                                            d-flex
                                            align-items-center
                                            flex-fill
                                            "
                                                >
                                                    <div
                                                        className="
                                                div
                                                l-1
                                                img-pf
                                                mx-2
                                                d-inline-block
                                                "
                                                        style={{
                                                            paddingBottom: '9%',
                                                            background: `url('${item.images[0].path}')`,
                                                            backgroundPosition: 'center',
                                                            backgroundSize: 'cover',
                                                            backgroundRepeat: 'no-repeat',
                                                        }}
                                                    ></div>
                                                    <span
                                                        className="
                                                    product-text
                                                    align-self-start
                                                    text-muted
                                                    l-5
                                                    text-break
                                                    lh-2
                                                    text-ellipsis
                                                    flex-fill
                                                    ms-2
                                                    me-4
                                                "
                                                    >
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <div className="product-prize w-20 d-flex mt-3">
                                                    <p className="prize-now">
                                                        {handleNum(item.price)}
                                                        <span className="under">đ</span>
                                                    </p>
                                                </div>
                                                <div className="product-sell-num l-2 mt-2">
                                                    <div className="pagination-sm d-flex">
                                                        <div className="page-item disabled ms-4" disabled="">
                                                            <span className="page-link">{item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="product-money l-2 mt-3">
                                                    <span className="text-warning">
                                                        {handleNum(item.price * item.quantity)}
                                                        <span className="under">đ</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="card-ship d-flex py-4">
                                <div
                                    className="
                                card-ship-form
                                form-group form-inline
                                d-flex
                                px-3
                            "
                                    style={{
                                        flexBasis: '40%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <label htmlFor="ship" style={{ flexBasis: '25%' }}>
                                        Lới nhắn
                                    </label>
                                    <input
                                        type="text"
                                        name="comment"
                                        id="ship"
                                        className="form-control"
                                        placeholder="Add comment for custommer"
                                    />
                                </div>
                                <div
                                    className="
                                card-ship-main
                                d-flex
                                justify-content-between
                                flex-fill
                                px-3
                                align-items-center
                                justify-content-between
                            "
                                >
                                    <span className="text-info">Đơn vị vận chuyển: </span>
                                    <div className="card-ship-main-opp">
                                        <h4 className="fs-5">Vận chuyển nhanh quốc tế</h4>
                                        <p className="card-text">
                                            <small>Standard express</small>
                                        </p>
                                    </div>
                                    <Link to="#" className="text-primary fs-5 text-decoration-none">
                                        Thay đổi
                                    </Link>
                                    <span className="text-muted me-2">
                                        {handleNum(30000)}
                                        <span className="under">đ</span>
                                    </span>
                                </div>
                            </div>
                            <div
                                className="
                            card-header
                            pay-ment-payrol-header
                            d-flex
                            p-3
                            align-items-center
                            bg-light
                        "
                            >
                                <h5 className="">Phương thức thanh toán</h5>

                                {1 === 1 && (
                                    <>
                                        {' '}
                                        <div
                                            className={
                                                typeShip[0]
                                                    ? 'btn-outline-info-selected btn btn-outline-info mx-3 px-3 position-relative'
                                                    : 'btn btn-outline-info mx-3 px-3 position-relative"'
                                            }
                                            onClick={() => changeCheck(0)}
                                        >
                                            Thanh toán khi nhận hàng
                                            {typeShip[0] && <i className="fas fa-check btn-icon-select"></i>}
                                        </div>
                                        <div
                                            className={
                                                typeShip[1]
                                                    ? 'btn-outline-info-selected btn btn-outline-info mx-3 px-3 position-relative'
                                                    : 'btn btn-outline-info mx-3 px-3 position-relative'
                                            }
                                            onClick={() => changeCheck(1)}
                                        >
                                            Thẻ tín dụng/Ghi nợ
                                            {typeShip[1] && <i className="fas fa-check btn-icon-select"></i>}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="card-body">
                                <div className="card-content w-25 float-end">
                                    <div
                                        className="
                                    card-text-wrap
                                    d-flex
                                    justify-content-between
                                    text-muted
                                "
                                    >
                                        <span className="card-text">Tổng tiền hàng : </span>
                                        <span className="card-prize me-2">
                                            {handleNum(totalCost())}
                                            <span className="under">đ</span>
                                        </span>
                                    </div>
                                    <div
                                        className="
                                    card-text-wrap
                                    d-flex
                                    justify-content-between
                                    text-muted
                                "
                                    >
                                        <span className="card-text">Phí vận chuyển : </span>
                                        <span className="card-prize me-2">
                                            {handleNum('30000')}
                                            <span className="under">đ</span>
                                        </span>
                                    </div>
                                    <div
                                        className="
                                    card-text-wrap
                                    d-flex
                                    justify-content-between
                                    text-muted
                                    align-items-center
                                "
                                    >
                                        <span className="card-text">Tổng tiền hàng :</span>
                                        <span className="card-prize me-2 fs-2 text-danger">
                                            {handleNum(totalCost() + 30000)}
                                            <span className="under">đ</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-between py-3">
                                <span className="card-text d-flex align-items-center">
                                    Ấn vào đặt hàng bạn đã đồng ý với
                                    <Link className="small ms-1" to="#">
                                        Điều khoản sử dụng
                                    </Link>
                                </span>
                                <button onClick={handleOrder} className="btn btn-primary px-4">
                                    Đặt hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loading2 mid={true} />
            )}
        </>
    );
};

export default Payment;
