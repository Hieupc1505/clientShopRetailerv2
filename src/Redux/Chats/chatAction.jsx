import { GET_CHAT_ALL, CHANGE_LIST_CHATS } from './typeChats';
import axios from 'axios';

const server = 'http://localhost:8500/v1';

export const updateLatestMessage = (userId, content, sender) => (dispatch) => {
    let index = users.map((item) => item.slug).indexOf(userId);

    dispatch({
        type: CHANGE_LIST_CHATS,
        payload: { index, content, sender },
    });
};

export const getListChat = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`http://localhost:8500/v1/users/chats`).catch(console.log);

        if (data?.success) {
            dispatch({
                type: GET_CHAT_ALL,
                payload: {
                    users: data.users,
                },
            });
        }
    } catch (err) {
        console.log(err);
    }
};
