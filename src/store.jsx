// import { combineReducers, applyMiddleware, createStore } from "redux";
// import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
// import { composeWithDevTools } from "redux-devtools-extension";
// import logger from "redux-logger";
// import { sportReducer } from "./redux/reducer";
// import chartSlice from "./redux/features/Charts/chartSlice";
// import statuSlice from "./redux/features/Status";

import { cartReduce } from "./Redux/Cart/cartReducer";
import { userAuth } from "./Redux/Auth/authReducer";
import { productsReducer, productDetailReducer } from "./Redux/ProductRedux/productsReducer";
import { chatsReducer } from "./Redux/Chats/chatReducer";

const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetail: productDetailReducer,
        userAuth,
        cartReducer: cartReduce,
        chats: chatsReducer,
    },
});

export default store;
