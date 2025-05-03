import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 

function Wyszukiwarka() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchResults, setSearchResults] = useState({
        text: "",
    });
    const { user } = useUser(); // Użycie kontekstu
    const [wyszukiwanieLista, setWyszukiwaniaList] = useState([]); // Stan dla wyszukiwania
    const [pisze, setPisanie] = useState(false); // Stan dla pisania

    function handleSearchResult(event) {
        setSearchResults((u) => ({ ...u, text: event.target.value }));
        setIsOpen(false); // Otwiera wyszukiwanie po kliknięciu
        setPisanie(true); // Ustawia stan pisania na true
    }
    async function dodawanieWyszukiwania() {
        try {
            const response = await fetch("/api/wyszukiwarka", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user._id, tresc: searchResults.text }),
            });
            const data = await response.json();
            console.log("Dodano do bazy danych:", data);
        } catch (error) {
            console.error("Błąd podczas dodawania do bazy danych:", error);
        }
    }

    function handleSearchSubmit(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Zapobiega domyślnemu zachowaniu (np. przeładowaniu strony)

            if (!searchResults.text.trim()) {
                console.error("Pole wyszukiwania jest puste. Nie można zatwierdzić.");
                return;
            }            
            console.log("Wartość pola wyszukiwania:", searchResults.text);
            // dodawanie do bazy danych 
            
            dodawanieWyszukiwania();
            setSearchResults({ text: "" }); // Resetowanie pola wyszukiwania // Resetowanie pola wyszukiwania
            setIsOpen(false); // Zamknięcie wyszukiwania po zatwierdzeniu
            setPisanie(false); // Ustawia stan pisania na false
        }
    }

    async function fetchWyszukiwania() {
              try {
                  const response = await fetch("/api/wyszukiwanie-pobieranie");
                  const wyszukiwanieLista2 = await response.json();
                  console.log("Ostatnie wyszukiwania:", wyszukiwanieLista2); // Debugowanie danych
                  setWyszukiwaniaList(wyszukiwanieLista2);
              } catch (error) {
                  console.error("Błąd pobierania wyszukiwan:", error);
              }
          }
      
    useEffect(() => {
        fetchWyszukiwania();
    }, []);

    useEffect(() => {
        console.log("Stan wyszukiwanieLista:", wyszukiwanieLista);
    }, [wyszukiwanieLista]);


    //prponowania 

    const [results, setResults] = useState([]); 
    useEffect(() => {
        const timeoutId = setTimeout(() => {
          if (searchResults.text) {
            fetch(`/api/search?q=${searchResults.text}`)
              .then(res => res.json())
              .then(data => setResults(data));
          }
        }, 300); 
      
        return () => clearTimeout(timeoutId);
      }, [searchResults.text]); 
      

    return (
        <>
        <div className="relative inline-block">
            <input
                placeholder="wyszukaj produkt"
                className="w-64 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setIsOpen(true)} 
                onBlur={() => {
                    setIsOpen(false);
                    setPisanie(false); 
                }}
                onChange={handleSearchResult}
                onKeyDown={handleSearchSubmit}
                value={searchResults.text} 

            />

            {isOpen && (
                <div  className="absolute left-0 mt-2 w-64 bg-white shadow-lg border rounded-md z-10">
                    <ul className="list-disc list-inside p-4 space-y-2">
                    {Array.isArray(wyszukiwanieLista) && wyszukiwanieLista.map((wyszukiwanie) => (
                                <li key={wyszukiwanie._id} className="text-xl font-bold text-center text-gray-800">
                                    {wyszukiwanie.tresc}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
            {pisze && (
                <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg border rounded-md z-10">
                    <ul className="list-disc list-inside p-4 space-y-2">
                        {results.map((result) => (
                            <li key={result._id} className="text-xl font-bold text-center text-gray-800">
                                {result.title} 
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            </div>
        </>
    );
}
export default Wyszukiwarka;