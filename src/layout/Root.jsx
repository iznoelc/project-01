import React from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import { ToastContainer, Zoom } from 'react-toastify';

const Root = () => {
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <NavBar />
        
        <div className="flex-1 overflow-hidden">
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Zoom}
            />
            {/* btw toast container needs to go here whenever thats configured if we r using toastify */}
            <Outlet />
        </div>

        <Footer/>
      </div>
    </>
  );
};

export default Root;