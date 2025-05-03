import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function CattegoryProductsView() {
    const { mainCategory, subCategory } = useParams(); 
    const [wspolne, setWspolne] = useState([]);

    useEffect(() => {
        async function fetchFilteredProducts() {
            try {
                const mainCategoryResponse = await fetch(`/api/kategoria/${encodeURIComponent(mainCategory)}`);
                const subCategoryResponse = await fetch(`/api/kategoria/${encodeURIComponent(subCategory)}`);
                
                const mainCategoryData = await mainCategoryResponse.json();

                const subCategoryData = await subCategoryResponse.json();

                console.log("Dane głównej kategorii:", mainCategoryData);
                console.log("Dane podkategorii:", subCategoryData);

                const mainCategoryProducts = mainCategoryData
                const subCategoryProducts = subCategoryData

                const wspolne = mainCategoryProducts.filter((mainProduct) =>
                    subCategoryProducts.some((subProduct) => subProduct._id.toString() === mainProduct._id.toString())
                );
                console.log("Wspólne produkty:", wspolne);

                setWspolne(wspolne);
            } catch (error) {
                console.error("Błąd podczas pobierania produktów:", error);
            }
        }

        fetchFilteredProducts();
    }, [mainCategory, subCategory]);

    return (
        <div className="max-w-5xl mx-auto my-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Produkty w kategorii: {mainCategory} / {subCategory}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wspolne.map((product) => (
                    <li key={product._id} className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.title}</h3>
                        <p className="text-gray-600 mb-1 text-center">{product.description}</p>
                        <p className="text-blue-600 font-bold mb-3">Price: {product.price} PLN</p>
                        <img src={`/pictures/${product.imageUrl}`} alt={product.title} className="w-36 h-36 object-cover rounded" />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CattegoryProductsView;