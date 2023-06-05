import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './component/MainPages/Page';

import Auth from './component/MainPages/Auth/Auth';
import PageNotFound from './component/MainPages/utils/NotFound/NotFound';
import UpImage from './component/MainPages/utils/UploadImg/UpImage';
import ProtectedRouteAdmin from './component/ProtectdRouteAdmin/ProtectedRouteAdmin';
import Test from './component/Views/Test';
function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage component="home" />} />
                    <Route path="/home" element={<MainPage component="home" />} />
                    <Route path="/upload" element={<MainPage component="upload" />} />
                    <Route path="/login" element={<Auth authRender="login" />} />

                    <Route path="/signup" element={<Auth authRender="signup" />} />
                    <Route path="/forget" exect element={<Auth authRender="forget" />} />

                    <Route path="/user/forget/account/:token" exect element={<Auth authRender="reset" />} />

                    <Route path="/products/cart" element={<MainPage component="cart" />} />
                    <Route path="/product/:id" element={<MainPage component="detail" />} />

                    <Route path="/cart/payment" element={<MainPage component={'payment'} />} />

                    <Route path="/orders/status" element={<MainPage component="order" />} />
                    <Route path="/page/search" element={<MainPage component={'search'} />} />

                    <Route path="/test" component={Test} />
                    <Route path="/admin/dashboard" element={<ProtectedRouteAdmin component={UpImage} />} />

                    {/* <ProtectedRouteAdmin path="/admin/dashboard" component={UpImage} /> */}

                    <Route path="/add/profile" element={<MainPage component={'profile'} />} />

                    <Route path="*" element={<PageNotFound type="404" />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
