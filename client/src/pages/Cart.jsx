import { useUser } from "../context/UserContext"; 
import React, { useEffect, useState } from "react";

function Cart() {
    const { user } = useUser(); 
    const [items, setItems] = useState(null); // Stan dla danych koszyka

    useEffect(() => {
        async function FetchItem() {
            try {
                if (!user) {
                    console.error("Użytkownik nie jest zalogowany");
                    return;
                }

                const response = await fetch(`/api/cart/${user._id}`); // Pobierz koszyk dla zalogowanego użytkownika
                const cartItems = await response.json();
                console.log('Koszyk:', cartItems); // Debugowanie danych
                

                const detailedItems = await Promise.all(
                    cartItems.map(async (cartItem) => {
                        const productResponse = await fetch(`/api/przedmioty-pobieranie/${cartItem.produktId}`);
                        const productData = await productResponse.json();
                        return {
                            ...cartItem, // Dane z koszyka (np. ilosc)
                            ...productData, // Dane produktu (np. title, cena, imageUrl)
                        };
                    })
                );

                console.log('Szczegóły produktów:', detailedItems); // Debugowanie szczegółowych danych
                setItems(detailedItems); // Ustaw dane koszyka w stanie


            } catch (error) {
                console.error('Błąd podczas pobierania przedmiotu z koszyka:', error);
            }
        }

        FetchItem();
    }, [user]); // Uruchom efekt, gdy zmieni się użytkownik

    if (!user) {
        return <p>Musisz się zalogować, aby zobaczyć koszyk.</p>;
    }

    if (!items) {
        return <p>Ładowanie danych koszyka...</p>;
    }
    const totalPrice = items.reduce((total, item) => {
        return total + (item.price * item.ilosc); 
    }, 0); //liczenie sumy
    console.log('Suma:', totalPrice); // Debugowanie sumy

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Witaj {user.login}, oto twoje produkty:</h1>
            <ul lassName="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {items.map((product) => (
                    <li key={product._id} className="border rounded-lg p-4 shadow-sm">
                        <img src={`/pictures/${product.imageUrl}`} alt={product.title} className="w-full h-64 object-contain rounded mb-4"/>
                        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                        <h3 className="text-sm text-gray-600">cena: {product.price}</h3>
                        <p className="text-sm text-gray-600">Ilość: {product.ilosc}</p>
                    </li>
                ))}
            </ul>
            <div className="text-center"> 
            <h2 className="text-xl font-semibold mb-2">do zaplaty:</h2>
            <p className="text-lg font-bold text-green-700 mb-4">{totalPrice} PLN</p>
            <button onClick={() => alert('Zamówienie złożone!')} className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors">Złóż zamówienie</button>
            </div>

        </div>
    );
}

export default Cart;