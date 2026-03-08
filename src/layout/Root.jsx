import React from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Root = () => {
  return (
    <>
      <div className="w-full h-screen">
        <NavBar />
        
        <div className="min-h-[70vh] p-10 m-10">
            {/* btw toast container needs to go here whenever thats configured if we r using toastify */}
            <Outlet />
        </div>

        <Footer/>
      </div>
    </>
  );
};

export default Root;