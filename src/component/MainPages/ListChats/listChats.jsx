import "./listChats.css";
import React, { useEffect, useState, useLayoutEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "../utils/ChatBox/ChatBox";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getListChat } from "../../../Redux/Chats/chatAction";
const ListChats = () => {
    // let [users, setUsers] = useState([]);
    const { user, isAuth, isLoad } = useSelector((state) => state.userAuth);
    const { users } = useSelector((state) => state.chats);
    let [chatWithUser, setChatWithUser] = useState([]);
    const [show, setShow] = useState(true);

    const dispatch = useDispatch();

    // const updateLatestMessage = (userId, content, sender) => {
    //     console.log("updateLastes ", userId, content, sender);
    //     let index = users.map((item) => item.slug).indexOf(userId);

    //     return setUsers([
    //         {
    //             ...users[index],
    //             message: content,
    //             sender,
    //         },
    //         ...users.slice(0, index),
    //         ...users.slice(index + 1, users.length),
    //     ]);
    // };

    // useLayoutEffect(() => {
    //     async function fetchData() {
    //         let { data } = await axios.get(`http://localhost:8500/v1/users/chats`).catch((err) => {
    //             console.log(err);
    //         });
    //         if (data.success === true) {
    //             const storeUser = data.users.map(({ slug, userName, messages }) => {
    //                 return {
    //                     userName,
    //                     message: messages[0].content,
    //                     sender: messages[0].sender,
    //                     slug: slug.replace(/_?admin_?/gi, ""),
    //                 };
    //             });
    //             setUsers(storeUser);
    //         }
    //     }
    //     fetchData();
    // }, [show]);
    useEffect(() => {
        dispatch(getListChat());
    }, []);
    const hanldeShowChatBox = (idTo, name, index) => {
        let userInList = chatWithUser.map((item) => item.idTo).includes(idTo);
        if (userInList === false) {
            setChatWithUser((pre) => [...pre, { idTo, name }]);
        }
    };

    const removeUser = (userId) => {
        setChatWithUser([...chatWithUser.filter((item) => item.idTo !== userId)]);
    };

    return (
        <div className="main-box-chat">
            {!show && (
                <div className="box-list-users">
                    <div className="box-header">Users</div>
                    <ul className="box-lists">
                        {!!users.length &&
                            users.map(({ userName, message, sender, slug }, index) => (
                                <li
                                    key={uuidv4()}
                                    className="box-item-user"
                                    onClick={() => hanldeShowChatBox(slug, userName, index)}
                                >
                                    <div className="box-user-avata">
                                        <img
                                            className="box-user-avata-img"
                                            alt="avata"
                                            src="https://res.cloudinary.com/develope-app/image/upload/v1626161751/images_j0qqj4.png"
                                        />
                                    </div>
                                    <div className="box-user-info">
                                        <div className="box-user-name">{userName}</div>
                                        <div className="box-user-newest-message">
                                            {sender === user.role ? `Bạn: ${message}` : message}
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
            {show && (
                <div className="chat-icon position-fixed" onClick={() => setShow(!show)}>
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
            {chatWithUser.length !== 0 &&
                chatWithUser.map(({ idTo, name }, index) => (
                    <ChatBox
                        key={uuidv4()}
                        pTo={idTo}
                        pName={name}
                        flag={true}
                        removeUser={removeUser}
                    />
                ))}
        </div>
    );
};

export default ListChats;
