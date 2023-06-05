import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import io from 'socket.io-client';
import { memo } from 'react';
import './chatbox.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { updateLatestMessage } from '../../../../Redux/Chats/chatAction';
import { Waypoint } from 'react-waypoint';

// const socket = io("https://serverchat69.herokuapp.com");
// https://serverchat69.herokuapp.com

// const socket = io("http://localhost:8500");
const ChatBox = ({ pTo, pName = 'Admin', flag = false, removeUser }) => {
    const { user, isAuth, isLoad } = useSelector((state) => state.userAuth);
    // const { messages } = useSelector((state) => state.chats);
    let [mes, setMes] = useState('');
    const [chats, setChat] = useState([]);
    let text = useRef();
    const dispatch = useDispatch();

    const [show, setShow] = useState({
        box: flag,
        send: false,
    });

    useEffect(() => {
        if (isAuth) socket.emit('setRole', { userId: user.userId, pTo, role: user.role });
    }, [isAuth]);
    useEffect(() => {
        socket.on('message-to-user', (data) => {
            setChat([...chats, data]);
        });
        socket.on('message-to-admin', (data) => {
            setChat([...chats, data]);
        });

        socket.on('message-reply', (data) => {
            if (user.role === 0 || (user.role === 1 && data.userId === pTo)) {
                setChat([...chats, data]);
            }
        });

        socket.on('dis', (payload) => {
            setChat([...chats]);
        });
    });
    useEffect(() => {
        async function fetchData() {
            let uuid = user.role === 1 ? pTo : user.userId;

            const { data } = await axios
                .get(`http://localhost:8500/v1/chats?userId=${uuid}`)
                .catch((err) => console.log(err));
            const { success, chats } = data;
            if (success) setChat([...chats]);
        }
        fetchData();
    }, []);

    const handleChangeInput = (e) => {
        setMes(e.target.value);
    };

    const validMes = (mes) => {
        const ban = /(boài|lồn|địt|đ!t)/gi;

        const check = ban.test(mes);
        return !!check;
    };

    const sendMess = async (text, to) => {
        const check = validMes(text);
        // let to = user.role === 1 ? user.userId.trim() : "admin";
        if (text && !check && isAuth) {
            const createdAt = new Date().toISOString();
            const payload = {
                userName: user.role === 1 ? pName : user.userName,
                content: text,
                sender: user.role,
                avata: user.avata,
                createdAt,
                userId: user.userId,
                to,
                name: user.role === 1 ? 'admin' : user.userName,
            };
            // console.log(payload);
            socket.emit('message-from', payload);
            setChat(() => [...chats, payload]);
            if (user.role === 1) dispatch(updateLatestMessage(to, text, payload.sender));
        } else {
            alert('Cái Loại mất dạy!!');
        }
        setShow({ ...show, send: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        document.querySelector('input.input-chat').blur();
        text.current = mes;
        setMes('');
        await sendMess(text.current, pTo);
    };

    const handleCloseBox = () => {
        if (user.role === 1) removeUser(pTo);
        setShow({ box: false, send: false });
    };
    const checkMessageInfo = (sender, tar) => {
        return sender !== tar;
    };

    const loadMoreData = async () => {
        let uuid = user.role === 1 ? pTo : user.userId;
        const date = chats[0].timestamps;
        console.log(date);
        const { data } = await axios
            .get(`http://localhost:8500/v1/chats?userId=${uuid}&oldDate=${date}`)
            .catch((err) => console.log(err));
        const { success, chats: query } = data;
        if (success) setChat([...query, ...chats]);
    };

    const chatRender = () => {
        let arr = chats.map((item) => item.sender);
        return chats.map(({ sender, content, name }, index) =>
            sender !== user.role ? (
                <li className="list-chat-item d-flex align-items-end" key={index}>
                    {index === arr.length - 1 || checkMessageInfo(sender, arr[index + 1]) ? (
                        <div className="box-mess-avata">
                            <img
                                src="https://res.cloudinary.com/develope-app/image/upload/v1626161751/images_j0qqj4.png"
                                alt="avatar"
                                className="list-chat-img me-2"
                            />
                        </div>
                    ) : (
                        <div className="box-mess-avata"></div>
                    )}
                    <div className="list-chat-me flex-fill">
                        {/* {createdAt && (
                        <small className="text-secondary">
                            {handleTime(createdAt)}
                        </small>
                    )} */}
                        {index === 0 || checkMessageInfo(sender, arr[index - 1]) ? (
                            <div className="list-chat-name small">{sender === 1 ? 'admin' : name}</div>
                        ) : (
                            <></>
                        )}
                        <div className="list-chat-content">{content}</div>
                    </div>
                </li>
            ) : (
                <li className="list-chat-item d-flex align-items-end justify-content-end" key={index}>
                    <div className="list-chat-me">
                        {/* {createdAt && (
                        <small className="text-secondary">
                            {handleTime(createdAt)}
                        </small>
                    )} */}

                        <div className="list-chat-content bg-primary text-white">{content}</div>
                    </div>
                </li>
            ),
        );
    };

    useLayoutEffect(() => {
        const wrap = document.querySelector('.chat-box-body');
        const list = document.querySelector('.list-chat');
        if (show.box && list) {
            wrap.scrollTo(0, list.scrollHeight);
            document.querySelector('input.form-control').addEventListener('focus', function () {
                setShow({ ...show, send: true });
            });
            document.querySelector('input.form-control').addEventListener('blur', function () {
                const text = this.value;
                if (!text) setShow({ ...show, send: false });
            });
        }
    }, [chats.length, show.box]);

    return (
        <>
            {!show.box && (
                <div className="chat-icon position-fixed" onClick={() => setShow({ ...show, box: true })}>
                    <svg
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    >
                        <defs>
                            <linearGradient id="gradient">
                                <stop offset="0%" stopColor="#098eff" />
                                <stop offset="50%" stopColor="#9a35ff" />

                                <stop offset="100%" stopColor="#ff5f73" />
                            </linearGradient>
                        </defs>
                        <path
                            id="chat-icon-mess"
                            d="M12 0c-6.627 0-12 4.975-12 11.111 0 3.497 1.745 6.616 4.472 8.652v4.237l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111 0-6.136-5.373-11.111-12-11.111zm1.193 14.963l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"
                        />
                    </svg>
                </div>
            )}
            {show.box && (
                <div
                    className="chat-box  border rounded"
                    style={isAuth && user.role === 0 ? { position: 'fixed' } : {}}
                >
                    <div className="chat-box-header d-flex justify-content-between border-bottom py-2 px-3 align-items-center">
                        <div className="show-onl d-flex align-items-center ">
                            <h3>{pName}</h3>

                            {/* {chat.onl !== 0 && (
                                <span className="user-onl ms-2 position-relative">{chat.onl}</span>
                            )} */}
                        </div>
                        <i className="fas fa-times cursor-pointer" onClick={handleCloseBox}></i>
                    </div>
                    <div className="chat-box-body pe-2">
                        {chats.length === 0 && (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                <span className="text-secondary">Gửi tin nhắn để trao đổi với chủ shop!!</span>
                            </div>
                        )}
                        <ul className="list-chat px-2">
                            {chats.length > 0 && <Waypoint onEnter={loadMoreData} />}
                            {chatRender()}
                        </ul>
                    </div>
                    <div className="chat-box-footer p-2">
                        <form className="chat-contetn form-inline" onSubmit={handleSubmit}>
                            <div className="form-group d-flex align-items-center">
                                <i className="fas fa-plus-circle me-2"></i>
                                <input
                                    type="text"
                                    name="mes"
                                    id="mes"
                                    placeholder="Aa"
                                    className="form-control form-control-sm input-chat"
                                    value={mes}
                                    onChange={handleChangeInput}
                                    autoComplete="off"
                                />
                                {!show.send && <i className="far fa-thumbs-up mx-2 cursor-pointer"></i>}
                                {/* {show.send && (
                                    <i
                                        className="far fa-paper-plane cursor-pointer mx-2"
                                        onClick={sendMess}
                                    ></i>
                                )} */}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(ChatBox);
