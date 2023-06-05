import { GET_CHAT_ALL, CHANGE_LIST_CHATS } from "./typeChats";

export const chatsReducer = (state = { users: [], isLoad: true }, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_CHAT_ALL:
            return {
                ...state,
                users: payload.users.map(({ slug, userName, messages }) => {
                    return {
                        userName,
                        message: messages[0].content,
                        sender: messages[0].sender,
                        slug: slug.replace(/_?admin_?/gi, ""),
                    };
                }),
            };
        case CHANGE_LIST_CHATS:
            let { index, content, sender } = payload;
            const { users } = state;
            return [
                {
                    ...users[index],
                    message: content,
                    sender,
                },
                ...users.slice(0, index),
                ...users.slice(index + 1, users.length),
            ];
            break;
        default:
            return state;
    }
};
