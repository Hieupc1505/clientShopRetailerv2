import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import handleNum from '../helpers/handleNum';
import Slide from '../utils/Slide/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { SingleDeleteCart, getDetailCart } from '../../../Redux/Cart/actionCard';
import { postCart } from '../../../Redux/Cart/actionCard';
import Loading2 from '../utils/Loading/Loading2';
import NotFound from '../utils/NotFound/NotFound';

const Cart = () => {
    const dispatch = useDispatch();
    const { user, isAuth } = useSelector((state) => state.userAuth);
    const { cart, number, error, isLoad } = useSelector((state) => state.cartReducer);
    const [box, setBox] = useState([]);
    // const history = useHistory();
    const navigate = useNavigate();
    const [pros, setPros] = useState([]);

    const [isCheckedAll, setIsCheckedAll] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (isAuth) {
                await dispatch(getDetailCart());
            }
        };
        fetchData();
    }, [number]);
    useEffect(() => {
        cart.length > 0 && setBox(Array(cart.length).fill(false));
    }, [cart.length]);

    const checkAll = (e) => {
        let isChecked = e.target.checked;
        setIsCheckedAll(() => isChecked);
        setBox(box.map((item) => isChecked));
    };

    const numCheck = () => {
        return box.filter(Boolean).length || 0;
    };

    const increase = (id) => {
        setPros(
            cart.map((item) => {
                if (item.productId === id) ++item.quantity;
                return item;
            }),
        );
    };

    const minus = (id) => {
        setPros(
            cart.map((item) => {
                if (item.productId === id) item.quantity = item.quantity === 1 ? 1 : --item.quantity;
                return item;
            }),
        );
    };

    const monTotal = () => {
        let money = 0;
        box.forEach((item, index) => {
            if (item === true) {
                money +=
                    parseInt(cart[index].price) *
                    (1 - parseInt(cart[index]?.proPromo || 1) / 100) *
                    cart[index].quantity;
            }
        });

        return money;
    };

    const removeProduct = (id) => {
        if (window.confirm('Xác nhận xoá sản phẩm khỏi giỏ hàng')) {
            dispatch(SingleDeleteCart(id));
        }
    };

    const handleBuyProduct = () => {
        const num = monTotal();
        if (num) {
            let arr = box.map((item, index) => item === true && cart[index]).filter(Boolean);

            navigate(`/cart/payment`, { state: { order: arr } });
        } else {
            alert('Bạn chưa chọn sản phẩm nào');
        }
    };

    const handleChangeInput = (e, index) => {
        const arr = box.map((item, id) => (id === index ? !item : item));
        if (arr.filter(Boolean).length === arr.length) setIsCheckedAll(() => true);
        else setIsCheckedAll(() => false);
        setBox(() => arr);
    };

    if (error) return <NotFound />;

    return (
        <>
            {isLoad && <Loading2 mid={true} />}
            {!isLoad && (
                <>
                    <div className="app grid wide bg-light">
                        <div className="card-pro">
                            <nav className="nav d-flex my-4 px-4 py-2 bg-white border rounded">
                                <li className="nav-item d-flex align-items-center flex-fill">
                                    <label className="nav-link ps-2 text-dark-60">Sản phẩm</label>
                                </li>
                                <li className="nav-item w-20 ms-auto l-2">
                                    <Link
                                        to="#"
                                        className="nav-link disabled ps-0"
                                        href="#"
                                        tabIndex="-1"
                                        aria-disabled="true"
                                    >
                                        Đơn Giá
                                    </Link>
                                </li>
                                <li className="nav-item l-2">
                                    <Link
                                        to="#"
                                        className="nav-link disabled ps-0"
                                        href="#"
                                        tabIndex="-1"
                                        aria-disabled="true"
                                    >
                                        Số Lượng
                                    </Link>
                                </li>
                                <li className="nav-item l-2">
                                    <Link
                                        to="#"
                                        className="nav-link disabled ps-0"
                                        href="#"
                                        tabIndex="-1"
                                        aria-disabled="true"
                                    >
                                        Số Tiền
                                    </Link>
                                </li>
                            </nav>
                            <div className="card-list ">
                                <div className="card-list-mark rounded border">
                                    {!isLoad && cart.length === 0 && (
                                        <h1 className="text-center text-muted mb-4 mt-4">Giỏ hàng trống</h1>
                                    )}
                                    {!isLoad &&
                                        cart.length > 0 &&
                                        cart.map((item, index) => (
                                            <div
                                                key={uuidv4()}
                                                className="cart-list-mark-wrap px-4 d-flex card-body bg-white"
                                            >
                                                <div className="product-desc d-flex align-items-center flex-fill">
                                                    <input
                                                        className="mx-3 form-check-input cursor-pointer"
                                                        type="checkbox"
                                                        name="item-check"
                                                        value={item.productId}
                                                        checked={box[index]}
                                                        onChange={(e) => handleChangeInput(e, index)}
                                                    />
                                                    <div
                                                        className="div l-1 img-pf mx-2"
                                                        style={{
                                                            paddingBottom: ' 9%',
                                                            background: ` url(${item?.images[0].path})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            backgroundRepeat: 'no-repeat',
                                                        }}
                                                    ></div>
                                                    <span className="product-text align-self-start text-muted l-5 text-break lh-2 text-ellipsis">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <div className="product-prize l-2 d-flex mt-3">
                                                    <small className="text-decoration-line-through text-muted me-2 ">
                                                        {handleNum(item.price)}
                                                        <span className="under">đ</span>
                                                    </small>
                                                    <p className="prize-now ">
                                                        {handleNum(
                                                            parseInt(item.proPrize) *
                                                                (1 - parseInt(item?.proPromo | 1) / 100),
                                                        )}
                                                        <span className="under">đ</span>
                                                    </p>
                                                </div>
                                                <div className="product-sell-num l-2 mt-2">
                                                    <div className="pagination-sm d-flex">
                                                        <div
                                                            className="page-link text-muted cursor-pointer"
                                                            onClick={() => minus(item.productId)}
                                                            // onClick={() => reduction(item._id)}
                                                        >
                                                            <i className="fas fa-minus"></i>
                                                        </div>
                                                        <div className="page-item cursor-pointer disabled" disabled>
                                                            <span className="page-link">{item.quantity}</span>
                                                        </div>
                                                        <div
                                                            className="page-link text-muted cursor-pointer"
                                                            onClick={() => increase(item.productId)}
                                                            // onClick={() => increase(item.id)}
                                                        >
                                                            <i className=" fas fa-plus"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="product-money l-2 mt-3 d-flex justify-content-between">
                                                    <span className="text-warning">
                                                        {handleNum(
                                                            parseInt(item.price) *
                                                                (1 - parseInt(item?.proPromo || 1) / 100) *
                                                                item.quantity,
                                                        )}
                                                        <span className="under">đ</span>
                                                    </span>
                                                    <span
                                                        className="me-5 cursor-pointer cart-remove-trash"
                                                        onClick={() => removeProduct(item.productId)}
                                                    >
                                                        <i className="far fa-trash-alt "></i>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <div className="px-4 card-footer d-flex align-items-center mt-4 border">
                                    <div className="footer-check">
                                        <input
                                            className="mx-3 form-input-check check-all cursor-pointer"
                                            type="checkbox"
                                            name="all"
                                            id="all"
                                            checked={isCheckedAll}
                                            onChange={checkAll}

                                            // onChange={handleCheck}
                                        />
                                        <label htmlFor="all">Chọn tất cả ({box.length})</label>

                                        {/* {numCheck().length === 0 && <span className="text-muted ms-1">(Xoá)</span>}
                                        {numCheck().length > 0 && (
                                            <Link to="#" className="ms-1 text-decoration-none" href="#">
                                                (Xoá)
                                            </Link>
                                        )} */}
                                    </div>
                                    <div className="footer-text ms-auto l-4 text-center d-flex align-items-center">
                                        <span className="ms-auto fs-6 text-dark-2">
                                            Tổng thanh toán ({numCheck()} sp):
                                        </span>
                                        <span className="text-warning fs-4 mx-3 mb-1">
                                            <span>{handleNum(monTotal())}</span>
                                            <span className="under">đ</span>
                                        </span>
                                    </div>
                                    <button className="btn btn-info text-white" onClick={handleBuyProduct}>
                                        {/* <Link
                                        to="/payment"
                                        className="text-decoration-none text-white"
                                    >
                                        Mua Hàng
                                    </Link> */}
                                        Mua Hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid wide">
                        <Slide title="Bạn có thể thích" type={`relative&userId=${user.userId}`} />
                        <div className="pagination justify-content-end">
                            <div className="page-item cursor-pointer">
                                <span className="page-link">Pre</span>
                            </div>
                            <div className="page-item cursor-pointer active">
                                <span className="page-link ">1</span>
                            </div>
                            <div className="page-item cursor-pointer">
                                <span className="page-link">2</span>
                            </div>
                            <div className="page-item cursor-pointer">
                                <span className="page-link">...</span>
                            </div>
                            <div className="page-item cursor-pointer">
                                <span className="page-link">Nex</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Cart;
