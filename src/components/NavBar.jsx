import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Logo from "../assets/flowers/pink_flower_logo.png";
import SavedLinks from "./SavedLinks";

import { IoFlower} from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { LuListTodo } from "react-icons/lu";
import { FaCloud } from "react-icons/fa";
import { PiLinkSimpleBold } from "react-icons/pi";

const navigation = [
    {name: "Home", link: "/", icon: <IoMdHome />},
    {name: "Messages", link: "/messages", icon: <FiMessageSquare />},
    {name: "To-Do", link: "/todo", icon: <LuListTodo />},
    {name: "Weather", link: "/weather", icon: <FaCloud />},
];

export default function NavBar(){
    const navigate = useNavigate();
    const { user, loggedIn, signOutUser } = useAuth(); // sign up with email and password or with google uses functions from the useAuth custom hook 

    return (
        <>
            {/* nav bar when the user is logged in */}
            {loggedIn && (
            <div className="navbar bg-base-100 shadow-sm fixed top-0 z-50 w-full">
            <div className="navbar-start">
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                </div>
                <ul
                    tabIndex="-1"
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    {navigation.map((n, index) => (
                    <li key={index}><a onClick={() => navigate(n.link)}>{n.icon} {n.name}</a></li>
                    ))}
                    <li><a onClick={()=>document.getElementById('links_modal').showModal()}><PiLinkSimpleBold /> Saved Links</a></li>
                    
                </ul>
                <SavedLinks />
                </div>
                <span className="text-4xl pl-4 pr-2"><IoFlower /></span>
                <a className="btn btn-ghost text-3xl fontdiner-swanky-regular" onClick={() => navigate("/", {replace: true})}>Your Garden</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                {navigation.map((n, index) => (
                    <li key={index}><a onClick={() => navigate(n.link)}>{n.icon} {n.name}</a></li>
                ))}
                <li><a onClick={()=>document.getElementById('links_modal').showModal()}><PiLinkSimpleBold /> Saved Links</a></li>
                <SavedLinks />
                </ul>
            </div>
            <div className="navbar-end flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
                <a className="text-xl pr-4">Welcome Back, {user.displayName}</a>
                <button className=" btn btn-primary" onClick={signOutUser}>Log Out</button>
            </div>
            </div>)}
            {/* nav bar when user is logged out */}
            {!loggedIn && (
            <div className="navbar bg-base-200 shadow-sm fixed top-0 z-50 w-full">
            <div className="navbar-start">
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                </div>
                {/* <ul
                    tabIndex="-1"
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li><a>Item 1</a></li>
                    <li>
                    <a>Parent</a>
                    <ul className="p-2">
                        <li><a>Submenu 1</a></li>
                        <li><a>Submenu 2</a></li>
                    </ul>
                    </li>
                    <li><a>Item 3</a></li>
                </ul> */}
                </div>
                <span className="text-4xl pl-4 pr-2"><IoFlower /></span>
                <a className="btn btn-ghost text-3xl fontdiner-swanky-regular" onClick={() => navigate("/", {replace: true})}>Your Garden</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                {/* <ul className="menu menu-horizontal px-1">
                <li><a>Item 1</a></li>
                <li>
                    <details>
                    <summary>Parent</summary>
                    <ul className="p-2 bg-base-100 w-40 z-1">
                        <li><a>Submenu 1</a></li>
                        <li><a>Submenu 2</a></li>
                    </ul>
                    </details>
                </li>
                <li><a>Item 3</a></li>
                </ul> */}
            </div>
            <div className="navbar-end gap-2">
                <button className="btn" onClick={() => navigate("/login")}>Login</button>
                <button className="btn btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
            </div>
            </div>

            )}
        </>
    );
}