import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import kontekstu
import { set } from "mongoose";


function ProductCard() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const { user } = useUser(); // Użycie kontekstu 
    const [comments, setComments] = useState([]); // Stan dla komentarzy
    const [isAdmin, setisAdmin] = useState(false);
    
    console.log("Globalny user:", user);
    useEffect(() => {
      if (user && user.isAdmin) {
          setisAdmin(true);
      } else {
          setisAdmin(false);
      }
  }, [user]);
    

    const [comment, setComment] = useState({
        description: "",
        rating: 0,
        });

    useEffect(() => {
        async function FetchItem() {
            try {
                const response = await fetch(`/api/przedmioty-pobieranie/${id}`);
                const item = await response.json();
                console.log('Item:', item); // Debugging data
                setItem(item);
            } catch (error) {
                console.error('Error w FetchItem:', error);
            }
        }
        FetchItem();
    }, [id]); 


    useEffect(() => {
        async function FetchComments() {
            try { 
                const response = await fetch(`/api/komentarz-pobieranie/${id}`);
                const comments = await response.json();
                console.log('Comments:', comments); // Debugging data
                setComments(comments);
            } catch (error) {
                console.error('Error w FetchComments:', error);
            }
        }
        FetchComments();
    }, [id]); 

    if (!item) {
        return <p>Ładowanie danych produktu...</p>;
    }

    const addToCart = async () => {
        try {
            if(!user) {
                console.error('Musisz sie zalogowac zeby dodac produkt do koszyka');
                return;
            }
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: item._id,
                    userId: user._id, 
                    ilosc: 1, // Domyślna ilość - dodac pozniej przycsik do zwiekszania ilosci 
                }),
            });
            if (response.ok) {
                console.log('Produkt dodany do koszyka');
            } else {
                console.error('Błąd podczas dodawania produktu do koszyka');
            }
        } catch (error) {
            console.error('Błąd w addToCart:', error);
        }
    }

    function handleDescriptionChange(event) {
        setComment((c) => ({ ...c, description: event.target.value }));
    }

    function handleRatingChange(event) {
        setComment((c) => ({ ...c, rating: event.target.value }));
    }

    async function handleDeleteComment(commentId) {
        try {
            const response = await fetch(`/api/delete-komentarz/${commentId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
                console.log('Komentarz usunięty');
            } else {
                console.error('Błąd podczas usuwania komentarza');
            }
        } catch (error) {
            console.error('Błąd w handleDeleteComment:', error);
        }
      
    }
    console.log("Globalny user:", user);


    return (
        <>
          <div className="max-w-4xl mx-auto mt-10 px-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Product Card</h2>
              <img
                src={`/pictures/${item.imageUrl}`}
                alt={item.title}
                className="w-72 h-72 object-cover mx-auto mb-4 rounded"
              />
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-gray-800">Title: {item.title}</p>
                <p className="text-gray-600">Description: {item.description}</p>
                <p className="text-blue-600 font-bold">Price: {item.price} PLN</p>
                <p className="text-orange-600 font-bold">id twórcy: {item.creatorUserId}</p>
                <p className="text-sm text-gray-500">Zalogowany użytkownik: {user ? user.login : "Brak użytkownika"}</p>

              </div>
              <button
                onClick={addToCart}
                className="mt-4 w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Add to cart
              </button>
            </div>
      
            <div className="bg-gray-100 rounded-lg shadow-inner p-6 mt-10">
              <h2 className="text-xl font-bold mb-4">Komentarze</h2>
      
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold">Dodaj komentarz</h3>
                <input
                  type="text"
                  placeholder="Napisz komentarz..."
                  value={comment.description}
                  onChange={handleDescriptionChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  placeholder="Ocena (0–5)"
                  value={comment.rating}
                  onChange={handleRatingChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={async () => {
                    setComment({ description: "", rating: 0 });
                    if (!user) {
                      console.error('Musisz się zalogować żeby dodać komentarz');
                      return;
                    }
                    try {
                      const response = await fetch('/api/komentarz', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          produktId: item._id,
                          description: comment.description,
                          rating: comment.rating,
                          creatorUserId: user._id,
                        }),
                      });
                      if (response.ok) {
                        console.log('Komentarz dodany');
                      } else {
                        console.error('Błąd podczas dodawania komentarza');
                      }
                    } catch (error) {
                      console.error('Błąd w dodawaniu komentarza:', error);
                    }
                  }}
                  className="mx-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors "
                >
                  Dodaj komentarz
                </button>
              </div>
      
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lista komentarzy</h3>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="bg-white p-4 rounded shadow">
                      <p className="text-gray-700">Opis: {comment.description}</p>
                      <p className="text-yellow-600">Ocena: {comment.rating}</p>
                      <p className="text-sm text-gray-500">Data: {new Date(comment.creationDate).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Użytkownik ID: {comment.creatorUserId}</p>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="mt-2 bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition-colors">
                          Usuń komentarz
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Brak komentarzy dla tego produktu.</p>
                )}
              </div>
            </div>
          </div>
        </>
      );
}

export default ProductCard;