import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import CattegoryProductsView from "../pages/CattegoryProductsView";


export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [kategorielista, setCattegoryList] = useState([]);

  async function fetchCattegory() {
          try {
              const response = await fetch("/api/kategoria-pobieranie");
              const kategorielista = await response.json();
              console.log("Użytkownicy:", kategorielista); // Debugowanie danych
              setCattegoryList(kategorielista);
          } catch (error) {
              console.error("Błąd pobierania użytkowników:", error);
          }
      }
  
      useEffect(() => {
          fetchCattegory();
      }, []);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-black hover:text-white px-3 py-2 rounded transition-colors duration-300">Męskie</button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-10">

          <ul className="list-disc list-inside p-4 space-y-2" >
                                {kategorielista.map((kategoria) => (
                                    <li key={kategoria._id} className="text-xl font-bold text-center text-gray-800">
                                        <Link to={`/CattegoryProductsView/Meskie/${kategoria.name}`}>{kategoria.name}</Link>
                                    </li>
                                ))}
                            </ul>

        </div>
      )}
    </div>
  );
}