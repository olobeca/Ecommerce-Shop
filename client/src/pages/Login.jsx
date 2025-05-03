import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

function Login() {
    const { user: contextUser, setUser: setContextUser } = useUser(); // Użycie kontekstu
    const [isAdmin, setisAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [kategorielista, setCattegoryList] = useState([]);

    const [user, setUser] = useState({
        login: "",
        haslo: "",
        email: "",
    });

    const [credentials, setCredentials] = useState({
        login: "",
        password: "",
    });

    const [item, setItem] = useState({
        title: "",
        price: "",
        description: "",
        imageUrl: "",
    });

    const [cattegory, setCattegory] = useState({
        name: "",
    });

    const [itemToDelete, setItemToDelete] = useState({
        title: "",
    });

    const [cattegoryToDelete, setCattegoryToDelete] = useState({
        name: "",
    });

    function handleCattegoryToDeleteChange(event) {
        setCattegoryToDelete((c) => ({ ...c, name: event.target.value }));
    }

    function handleItemToDeleteChange(event) {
        setItemToDelete((i) => ({ ...i, title: event.target.value }));
    }

    async function fetchUsers() {
        try {
            const response = await fetch("/api/check-user");
            const data = await response.json();
            console.log("Użytkownicy:", data); // Debugowanie danych
        } catch (error) {
            console.error("Błąd pobierania użytkowników:", error);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        const storedUser = localStorage.getItem("loggedInUser");
        if (loggedIn && storedUser) {
            setIsLoggedIn(true);
            const parsedUser = JSON.parse(storedUser);
            setContextUser(parsedUser); // Ustaw użytkownika w kontekście
            setCredentials(parsedUser);
            setisAdmin(parsedUser.isAdmin || false);
        }
    }, [setContextUser]);

    function handleLoginChange(event) {
        setUser((u) => ({ ...u, login: event.target.value }));
    }

    function handleHasloChange(event) {
        setUser((u) => ({ ...u, haslo: event.target.value }));
    }

    function handleEmailChange(event) {
        setUser((u) => ({ ...u, email: event.target.value }));
    }

    function handleCattegoryChange(event) {
        setCattegory((c) => ({ ...c, name: event.target.value }));
    }

    function handleAddUser() {
        console.log("Dane wysyłane do serwera:", user); // Debugowanie danych
        fetch("http://localhost:5001/api/uzytkownik", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((data) => console.log("Użytkownik dodany:", data))
            .catch((error) => console.error("Error w handleAddUser:", error));
        setUser({
            login: "",
            haslo: "",
            email: "",
        });
    }

    async function handleLogin() {
        console.log("Dane wysyłane do serwera:", credentials); // Debugowanie danych

        try {
            const response = await fetch("/api/check-user");
            const users = await response.json();
            const loggedInUser = users.find(
                (u) =>
                    u.login === credentials.login &&
                    u.haslo === credentials.password
            );
            if (loggedInUser) {
                setIsLoggedIn(true);
                console.log("Zalogowany:", loggedInUser);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(loggedInUser)
                ); // Zapisz dane użytkownika
                setCredentials(loggedInUser);
                setContextUser(loggedInUser); // Ustaw dane użytkownika w kontekście
                if (loggedInUser.isAdmin === true) {
                    setisAdmin(true); // Program wie, że user jest adminem
                    console.log("Zalogowany jako admin:", loggedInUser);
                }
            } else {
                alert("Niepoprawny login lub hasło");
            }
        } catch (error) {
            console.error("Error w handleLogin:", error);
        }
    }

    function handleLogout() {
        setIsLoggedIn(false);
        setCredentials({ login: "", password: "" });
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUser");
        setisAdmin(false);
        setContextUser(null); // Wyczyszczenie użytkownika w kontekście
    }

    function handleTitleChange(event) {
        setItem((i) => ({ ...i, title: event.target.value }));
    }

    function handlePriceChange(event) {
        setItem((i) => ({ ...i, price: event.target.value }));
    }

    function handleDescriptionChange(event) {
        setItem((i) => ({ ...i, description: event.target.value }));
    }

    function handleImageUrlChange(event) {
        setItem((i) => ({ ...i, imageUrl: event.target.value }));
    }

    function handleAddItem() {
        if (!credentials._id) {
            console.error("Brak ID użytkownika. Nie można dodać przedmiotu.");
            return;
        }

        const updatedItem = {
            ...item,
            creatorUserId: contextUser._id, // Ustaw creatorUserId dynamicznie
        };
        console.log("Dane wysyłane do serwera:", updatedItem); // Debugowanie danych
        fetch("http://localhost:5001/api/produkt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedItem),
        })
            .then((response) => response.json())
            .then((data) => console.log("Przedmiot dodany:", data))
            .catch((error) => console.error("Error w handleAddItem:", error));
        setItem({
            title: "",
            price: "",
            description: "",
            imageUrl: "",
        });
    }

    useEffect(() => {
        console.log("Zalogowany użytkownik:", credentials);
    }, [credentials]);


    function addCattegory() {
        const categoryName = cattegory.name;
        if (!categoryName) {
            console.error("Nazwa kategorii nie może być pusta.");
            return;
        }
        setCattegory({
            name: "",
        });
        console.log("Dane wysyłane do serwera:", categoryName); // Debugowanie danych
        fetch("http://localhost:5001/api/kategoria-dodawanie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: categoryName }),
        })
            .then((response) => response.json())
            .then((data) => console.log("Kategoria dodana:", data))
            .catch((error) => console.error("Error w addCattegory:", error));
    }

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

    

    const [itemCattegory, setItemCattegory] = useState({
        itemName: "",
        cattegoryName: "",
    });
    function handleItemCattegoryChange(event) {
        setItemCattegory((i) => ({ ...i, itemName: event.target.value }));
    }
    function handleCattegoryNameChange(event) {
        setItemCattegory((i) => ({ ...i, cattegoryName: event.target.value }));
    }
    async function handleAddItemCattegory() {
        const { itemName, cattegoryName } = itemCattegory;
    
        if (!itemName || !cattegoryName) {
            console.error("Nazwa przedmiotu i kategoria nie mogą być puste.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5001/api/przedmioty-pobieranie");
            const items = await response.json();
    
            const matchedItem = items.find((item) => item.title === itemName);
            console.log("Dopasowany przedmiot:", matchedItem); // Debugowanie danych
    
            if (!matchedItem) {
                console.error("Nie znaleziono przedmiotu o podanej nazwie:", itemName);
                return;
            }
    
            const payload = {
                itemId: matchedItem._id, // ID dopasowanego przedmiotu
                cattegoryName: cattegoryName, // Nazwa kategorii
            };

            setItemCattegory({
                itemName: "",
                cattegoryName: "",
            });
    
            console.log("Dane wysyłane do serwera:", payload); // Debugowanie danych
    
            const postResponse = await fetch("http://localhost:5001/api/produkt-kategoria", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            const data = await postResponse.json();
            console.log("Przedmiot dodany do kategorii:", data);
        } catch (error) {
            console.error("Error w handleAddItemCattegory:", error);
        }
    
       
    }

    async function deleteItem() {
        const itemName = itemToDelete.title;
        if (!itemName) {
            console.error("Nazwa przedmiotu nie może być pusta.");
            return;
        }
        setItemToDelete({
            title: "",
        });
        
        console.log("Dane wysyłane do serwera:", itemName); // Debugowanie danych
        fetch(`http://localhost:5001/api/usun-przedmiot/${encodeURIComponent(itemName)}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: itemName }),
        })
            .then((response) => response.json())
            .then((data) => console.log("Przedmiot usunięty:", data))
            .catch((error) => console.error("Error w deleteItem:", error));
    }

    async function deleteCattegory() {
        const cattegoryName = cattegoryToDelete.name;
        if (!cattegoryName) {
            console.error("Nazwa kategorii nie może być pusta.");
            return;
        }
        setCattegoryToDelete({
            name: "",
        });
        
        console.log("Dane wysyłane do serwera:", cattegoryName); // Debugowanie danych
        fetch(`http://localhost:5001/api/usun-kategorie/${encodeURIComponent(cattegoryName)}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: cattegoryName }),
        })
            .then((response) => response.json())
            .then((data) => console.log("Przedmiot usunięty:", data))
            .catch((error) => console.error("Error w deleteItem:", error));
    }

    const [userToGiveAdmin, setUserToGiveAdmin] = useState({
        login: "",
    });
    function handleUserToGiveAdminChange(event) {
        setUserToGiveAdmin((u) => ({ ...u, login: event.target.value }));
    }

    async function handleGiveAdmin() {
        const userName = userToGiveAdmin.login;
        if (!userName) {
            console.error("Nazwa użytkownika nie może być pusta.");
            return;
        }
        setUserToGiveAdmin({
            login: "",
        });
        
        console.log("Dane wysyłane do serwera:", userName); // Debugowanie danych
        fetch(`http://localhost:5001/api/nadanie-admina`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: userName }),
        })
            .then((response) => response.json())
            .then((data) => console.log("Przedmiot usunięty:", data))
            .catch((error) => console.error("Error w deleteItem:", error));


    }


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {!isLoggedIn ? (
                <div id="forms" className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6">
                    <h1>Załóż Konto</h1>
                    <div className="login-register-form">
                        <input
                            type="text"
                            id="login-input"
                            placeholder="Login"
                            value={user.login}
                            onChange={handleLoginChange}
                            className="input"
                        />
                        <input
                            type="password"
                            id="password-input"
                            placeholder="Hasło"
                            value={user.haslo}
                            onChange={handleHasloChange}
                            className="input"
                        />
                        <input
                            type="text"
                            id="email-input"
                            placeholder="Email"
                            value={user.email}
                            onChange={handleEmailChange}
                            className="input"
                        />
                        <button onClick={handleAddUser} className="btn">Zarejestruj</button>
                    </div>
                    <h1>Zaloguj się</h1>
                    <div>
                        <input
                            type="text"
                            placeholder="Login"
                            value={credentials.login}
                            onChange={(e) =>
                                setCredentials({
                                    ...credentials,
                                    login: e.target.value,
                                })
                            }
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder="Hasło"
                            value={credentials.password}
                            onChange={(e) =>
                                setCredentials({
                                    ...credentials,
                                    password: e.target.value,
                                })
                            }
                            className="input"
                        />
                        <button className="btn" onClick={handleLogin}>Zaloguj</button>
                    </div>
                </div>
            ) : (
                <div id="logged-in" className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6">
                    <h1>Jesteś zalogowany - witaj {credentials.login}</h1>
                    {isAdmin ? (
                        <>
                            <h2>
                                Jesteś administratorem, więc możesz dodawać
                                produkty 
                            </h2>
                            <h3>Dodawanie produktów:</h3>
                            <input
                                type="text"
                                placeholder="nazwa przedmiotu"
                                value={item.title}
                                onChange={handleTitleChange}
                                className="input"
                            ></input>
                            <input
                                type="number"
                                placeholder="cena"
                                value={item.price}
                                onChange={handlePriceChange}
                                className="input"
                            ></input>
                            <textarea
                                type="text"
                                placeholder="opis"
                                value={item.description}
                                onChange={handleDescriptionChange}
                                className="textarea"
                            ></textarea>
                            <input
                                type="text"
                                placeholder="imageUrl"
                                value={item.imageUrl}
                                onChange={handleImageUrlChange}
                                className="input"
                            ></input>
                            <button onClick={handleAddItem} className="btn">
                                Dodaj przedmiot
                            </button>
                            <h3>Dodawanie kategorii:</h3>
                            <input className="input" placeholder="nazwa kategorii" value={cattegory.name} onChange={handleCattegoryChange}></input>
                            <button onClick={addCattegory} className="btn">Dodaj kategorię</button>
                            <h3>Dostępne kategorie:</h3>
                            <ul className="list-disc list-inside">
                                {kategorielista.map((kategoria) => (
                                    <li key={kategoria._id} className="text-xl font-bold text-center text-gray-800">
                                        {kategoria.name}
                                    </li>
                                ))}
                            </ul>
                            <h3>Dodaj przedmiot do kategorii:</h3>
                            <input onChange={handleItemCattegoryChange} className="input" placeholder="Podaj nazwe przedmiotu" value={itemCattegory.itemName}></input>
                            <input onChange={handleCattegoryNameChange} className="input" placeholder="Podaj nazwe kategorii" value={itemCattegory.cattegoryName}></input>
                            <button className="btn" onClick={handleAddItemCattegory}>Dodaj przedmiot do kategorii</button>
                            <h3>Usuwanie przedmiotu ze sklepu:</h3>
                            <input className="input" onChange={handleItemToDeleteChange} placeholder="Podaj nazwe przedmiotu" value={itemToDelete.title}></input>
                            <button className="btn" onClick={deleteItem}>Usuń przedmiot</button>
                            <h3>Usuwanie kategorii:</h3>
                            <input className="input" onChange={handleCattegoryToDeleteChange} placeholder="Podaj nazwe kategorii" value={cattegoryToDelete.name}></input>
                            <button className="btn" onClick={deleteCattegory}>Usuń kategorie</button>
                            <h3>Nadawanie innemu uzytkwonikowi admina:</h3>
                            <input className="input" onChange={handleUserToGiveAdminChange} placeholder="Podaj nazwe uzytkownika" value={userToGiveAdmin.login}></input>
                            <button className="btn" onClick={handleGiveAdmin}>nadaj admina</button>

                        </>
                    ) : (
                        <>
                            <h2>Jesteś zwykłym użytkownikiem</h2>
                            <h3>Twoje zamówienia:</h3>
                        </>
                    )}
                    <button id="addCattegoryBtn" onClick={handleLogout} className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors">Wyloguj</button>

                </div>
            )}
        </div>
    );
}

export default Login;