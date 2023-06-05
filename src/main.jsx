import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

import "./public/css/fontawesome-free-5.15.3-web/css/all.css";
import "./public/css/bootstrap.min.css";
import "./public/css/grid.css";
import "./public/css/main.css";
import "./public/css/header.css";
import "./public/css/detail.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
