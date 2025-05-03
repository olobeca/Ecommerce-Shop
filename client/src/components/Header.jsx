import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./SidebarMeskie"; 
import Sidebar2 from "./SidebarDamskie"
import Wyszukiwarka from "./Wyszukiwarka"; //czmeu tu jets blad?? pomimo ze dziala
function Header() {
    return (
        <header class="sticky top-0 z-50 bg-gradient-to-r from-black to-white text-black py-4 shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">My E-commerce Shop</h1>
            <Sidebar />
            <Sidebar2/>
            <Wyszukiwarka />

            <img src="/pictures/logo.jpg" alt="logo" className="h-16 w-16"/>
            <nav className="space-x-4">
                <Link className="text-black hover:text-white px-3 py-2 rounded transition-colors duration-300" to="/">Home</Link> 
                <Link className="text-black  hover:text-white px-3 py-2 rounded transition-colors duration-300" to="/login">Account</Link> 
                <Link className="text-black hover:text-white px-3 py-2 rounded transition-colors duration-300" to="/cart">Cart</Link> 
            </nav>
            </div>
        </header>
    );

} 
export default Header;