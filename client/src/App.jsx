import React from "react"; 
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header"; 
import Login from "./pages/Login"; 
import Cart from "./pages/Cart"; 
import ProductCard from "./components/ProductCard";
import { UserProvider } from "./context/UserContext";
import CattegoryProductsView from "./pages/CattegoryProductsView"; 

function App() {
    return (
        <UserProvider> 
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductCard />} />
                <Route path="/CattegoryProductsView/:mainCategory/:subCategory" element={<CattegoryProductsView />} />
            </Routes>
        </div>
        </UserProvider>
    )

}

export default App;