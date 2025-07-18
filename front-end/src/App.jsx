import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import PostAdCategory from "./components/PostAdCategory";
import PostCarsForm from "./components/PostCarsForm";
import ProductSuccessPage from "./components/ProductSuccessPag";
import ProductDetails from "./components/ProductDetails";
import Wishlist from "./components/Wishlist";
// import PostMobile from './components/PostMobile';
import Cart from "./components/Cart";
import ProfilePage from "./components/Profilepage";
import EditProfile from "./components/EditProfile";
import CreatePasswordPage from "./components/CreatePasswordPage";
import UserListings from "./components/UserListings";
// import InboxChat from './components/InboxChat';
import ChatWrapper from "./components/ChatWrapper";
import EditListing from "./components/EditListing";
import SuccessPage from "./components/SuccessUpdate";
import Reaceiverchat from "./components/Receiverchat";
import Layout from "./components/Layout";

function App() {
  const ActiveUser = localStorage.getItem("user");
  const parsedUser = ActiveUser ? JSON.parse(ActiveUser) : null;
  const isLoggedIn = Boolean(ActiveUser);

  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Home />} />
          <Route path="/products/:categoryName" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {isLoggedIn ? (
            <>
              <Route path="/post-ad/category" element={<PostAdCategory />} />
              <Route path="/category/cars" element={<PostCarsForm />} />
              <Route path="/category/mobiles" element={<PostCarsForm />} />
              <Route path="/category/bikes" element={<PostCarsForm />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/category/cars/productSuccess"
                element={<ProductSuccessPage />}
              />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/editProfile/info" element={<EditProfile />} />
              <Route
                path="/settings/privacy"
                element={<CreatePasswordPage />}
              />
              <Route path="/ads" element={<UserListings />} />
              <Route
                path="/edit-listing/:listingId"
                element={<EditListing />}
              />
              <Route path="/updatepage" element={<SuccessPage />} />
              <Route
                path="/chat/:receiverId"
                element={<ChatWrapper senderId={parsedUser?._id} />}
              />
              <Route path="/chat/receave" element={<Reaceiverchat />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
