import React, {useState, useEffect} from "react"; 
import { Link } from "react-router-dom"; 
import ChatBot from "./ChatBot";

function ProductList() {

    const [isOpen, setIsOpen] = useState(false);
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const [items, setItems] = useState([]);
    async function pobieranieitemow() {
    try {
        const response = await fetch('/api/przedmioty-pobieranie');
        const items = await response.json();
        console.log('Items:', items); // Debugging data
        setItems(items);

    } catch(error) {
        console.error('Error w handleLogin:', error);
    }
    
    }
    //pobieranie dopiero po zalladowaniu komponentu
    useEffect(() => {
        pobieranieitemow();
    }, []);

    return (
        <div className="max-w-5xl mx-auto my-8 px-4 static">
            <h2 className="text-2xl font-bold mb-6 text-center">Product List</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.map(item => (
                    <Link to ={`/product/${item._id}`} className="block">
                    <li className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        <h3  className="text-lg font-semibold mb-2 text-gray-800">{item.title}</h3>
                        <p className="text-gray-600 mb-1 text-center">{item.description}</p>
                        <p className="text-blue-600 font-bold mb-3">Price: {item.price} PLN</p>
                        <img src={`/pictures/${item.imageUrl}`} alt={item.title} 
                         className="w-36 h-36 object-cover rounded" />
                    </li>
                    </Link>
                ))}
            </ul>
            <div class="absolute bottom-0 right-0 my-2 px-4">  
            {isOpen ? (
                <ChatBot />
            ) : (
                <button onClick={toggleChat} className="bg-green-500 text-black px-4 py-2 rounded">OPEN CHAT</button>
            )}
            </div>
        </div>
    );
}

export default ProductList;