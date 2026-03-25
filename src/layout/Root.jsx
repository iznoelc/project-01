import React from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import MessagesProvider from '../contexts/MessagesProvider.jsx';
import ChatsProvider from '../contexts/ChatsProvider.jsx';

import { ToastContainer, Zoom } from 'react-toastify';

const Root = () => {
  return (
    <>
    <MessagesProvider>
    <ChatsProvider>
      <div className="w-full h-screen flex flex-col">
        <NavBar />
        
        <div className="flex-1 pt-16 overflow-auto">
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
      </ChatsProvider>
      </MessagesProvider>
    </>
  );
};

export default Root;