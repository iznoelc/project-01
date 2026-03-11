import React from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import { ToastContainer, Zoom } from 'react-toastify';

const Root = () => {
  return (
    <>
      <div className="w-full h-screen">
        <NavBar />
        
        <div className="min-h-[70vh] p-10 m-10">
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