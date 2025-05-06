const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const uzytkownik= require('./models/uzytkownik');
const produkt = require('./models/produkt');
const koszyk = require('./models/koszyk'); 
const komentarz = require('./models/komentarz');
const kategoria = require('./models/kategoria'); // Importuj model Kategoria
const wyszukiwania = require('./models/wyszukiwania'); // Importuj model Wyszukiwania
//tutaj zainoportuje modele jak je zrobie 

const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.options('/api/*', cors(corsOptions));
app.use(express.json());

const logger = (req,res, next) => {
    const czas = new Date().toISOString();
    console.log(`${req.method} ${req.url} ${czas}`);
    next();
};

app.use(logger);


try {
    mongoose.connect("mongodb+srv://olobeca:dobromir1@ecommerce-shop.sqgcgq9.mongodb.net/Ecommerce-Shop?retryWrites=true&w=majority&appName=Ecommerce-Shop")
    .then(() => console.log('Polaczono z MongoDB'));
} catch (error) {
    console.error('Nie mozna polaczyc z mongodb', error);
}



// Start serwera
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});



//endpoint do dodawania uzytkownika

app.post('/api/uzytkownik', async (req, res) => {
    console.log('Otrzymane dane:', req.body); // Debugowanie danych

    try {
        const { login, haslo, email } = req.body;

        if (!login || typeof login !== 'string') {
            console.error('Niepoprawny login:', login);
            return res.status(400).json({ message: 'Niepoprawny login' });
        }
        if (!haslo || typeof haslo !== 'string') {
            console.error('Niepoprawne haslo:', haslo);
            return res.status(400).json({ message: 'Niepoprawne haslo' });
        }
        if (!email || typeof email !== 'string') {
            console.error('Niepoprawny email:', email);
            return res.status(400).json({ message: 'Niepoprawny email' });
        } 

        const newUser = new uzytkownik({ login, haslo, email });
        console.log('Tworzenie nowego uzytkownika:', newUser); // Debugowanie danych    
        await newUser.save();
        console.log('Użytkownik zapisany:', newUser);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Błąd podczas dodawania użytkownika:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
}); 


//endpoint do dodawania przedmiotu
app.post('/api/produkt', async (req, res) => {
    console.log('Otrzymane dane:', req.body); // Debugowanie danych

    try {
        const { title, price, description, imageUrl, creatorUserId, colors } = req.body;

        const newItem = new produkt({ title, price, description, imageUrl, creatorUserId, colors });
        console.log('Tworzenie nowego przedmiotu:', newItem); // Debugowanie danych    
        await newItem.save();
        console.log('Przedmiot dodany:', newItem);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Błąd podczas dodawania przedmiotu:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});


// Endpoint do dodawania przedmiotu do koszyka
app.post('/api/cart', async (req, res) => {
    console.log('oprzymane dane:', req.body); // Debugowanie danych

    try {
        const { itemId, userId, ilosc } = req.body;

        const newCart = new koszyk({
            produktId: itemId, // Przypisz itemId do produktId
            creatorUserId: userId, // Przypisz userId do creatorUserId
            ilosc,
        });
        console.log('Tworzenie nowego przedmiotu:', newCart); // Debugowanie danych    
        await newCart.save();
        console.log('Koszyk dodany:', newCart);
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Błąd podczas dodawania koszyka:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

// Endpoint do dodawania komentarza
app.post('/api/komentarz', async (req, res) => {
    console.log('otrzymane dane komentarza', req.body); // Debugowanie danych 

    const { produktId, description, rating, creatorUserId } = req.body;
    try {
        const newComment = new komentarz({
            produktId,
            description,
            rating,
            creatorUserId,
        });
        console.log('Tworzenie nowego komentarza:', newComment); // Debugowanie danych    
        await newComment.save();
        console.log('Komentarz dodany:', newComment);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Błąd podczas dodawania komentarza:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }

})

//endpoint do dodawania kategorii 
app.post('/api/kategoria-dodawanie', async (req, res) => {
    console.log('Otrzymane dane:', req.body); // Debugowanie danych 
    try {
        const {name} = req.body;
        const newCategory = new kategoria({ name });
        console.log('Tworzenie nowej kategorii:', newCategory); // Debugowanie danych
        await newCategory.save();
        console.log('Kategoria dodana:', newCategory);
        res.status(201).json(newCategory);

    } catch(error) {
        console.error('Błąd podczas dodawania kategorii:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }

});

/// endpoint do sprawcdzania uzytkownikow w bazie danych 
app.get('/api/check-user', async (req,res) => {
    try {
      const users = await uzytkownik.find({}); 
      res.status(200).json(users);
    } catch (error) {
      console.error('Błąd podczas pobierania uzytkownikow:', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas pobierania uzytkownikow.' });
    }
});



//endpoint do pobierania komemtarzy 
app.get('/api/komentarz-pobieranie/:productId', async (req,res) => {
    try {
        const { productId } = req.params;
        console.log('Otrzymane id:', productId); // Debugowanie danych
        const comments = await komentarz.find({ produktId: productId }); 
        res.status(200).json(comments);

    } catch(error) {
        console.error('Błąd podczas pobierania komentarzy:', error);
        res.status(500).json({ error: 'Wystąpił blad podczas pobierania komentarzy.' });
    }

})

//endpoint do pobierania kategorii
app.get('/api/kategoria-pobieranie', async (req,res) => {
    try {
      const categories = await kategoria.find({}); 
      res.status(200).json(categories);
    } catch (error) {
      console.error('Błąd podczas pobierania kategorii:', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas pobierania kategorii.' });
    }
  })



// Endpoint do pobierania przedmiotow 

app.get('/api/przedmioty-pobieranie', async (req,res) => {
    try {
      const items = await produkt.find({}); 
      res.status(200).json(items);
    } catch (error) {
      console.error('Błąd podczas pobierania przedmiotow:', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas pobierania przedmiotow.' });
    }
  }) 

  //endpoint do pobierania przedmiotow z koszyka dla id
app.get('/api/cart/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const cartItems = await koszyk.find({ creatorUserId: id }); 
        console.log('Otrzymane przedmioty z koszyka:', cartItems); // Debugowanie danych
        res.status(200).json(cartItems);
    } catch(error) {
        console.error('Błąd podczas pobierania przedmiotu z koszyka:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania przedmiotu z koszyka.' });

    }
});
  

// Endpoint do pobierania przedmiotu po id
app.get('/api/przedmioty-pobieranie/:id', async (req,res) => {
    try {
        const { id } = req.params;
        console.log('Otrzymane id:', id); // Debugowanie danych
        const item = await produkt.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Nie znaleziono przedmiotu o podanym id' });
        }
        res.status(200).json(item);
    } catch(error) 
    {
        console.error('Błąd podczas pobierania przedmiotu dla id:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania przedmiotu dlas id.' });
    }

})


//endpoint do dodawqania pezedmiotow do kategorii
app.post('/api/produkt-kategoria', async (req, res) => {
    try {
        const { itemId, cattegoryName } = req.body;

        if (!itemId || !cattegoryName) {
            return res.status(400).json({ message: 'Brak wymaganych danych: itemId lub cattegoryName' });
        }

        const category = await kategoria.findOne({ name: cattegoryName });
        if (!category) {
            return res.status(404).json({ message: `Nie znaleziono kategorii o nazwie: ${cattegoryName}` });
        }

        if (category.products.includes(itemId)) {
            return res.status(400).json({ message: 'Przedmiot już istnieje w tej kategorii' });
        }
        //dodawanie przedmiotu do tej kategorii
        category.products.push(itemId);
        await category.save();

        console.log(`Przedmiot ${itemId} został dodany do kategorii ${cattegoryName}`);
        res.status(200).json({ message: `Przedmiot został dodany do kategorii ${cattegoryName}`, category });
    } catch (error) {
        console.error('Błąd podczas dodawania przedmiotu do kategorii:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

//endpoint do pobierania przedmiotow z danej kategorii 
app.get('/api/kategoria/:name', async (req, res) => {
    try {
        const { name } = req.params;

        const category = await kategoria.findOne({ name }).populate('products');
        if (!category) {
            return res.status(404).json({ message: `Nie znaleziono kategorii o nazwie: ${name}` });
        }

        const products = await produkt.find({ _id: { $in: category.products } });
        res.status(200).json(products);
    } catch (error) {
        console.error('Błąd podczas pobierania przedmiotów dla kategorii:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

//enpoint do usuwania kategorii 

app.delete('/api/usun-kategorie/:name', async (req, res) => {
    try {
        const {name } = req.params;
        const kategoriaData = await kategoria.findOne({ name: name });

        const deletedKategoria = await kategoria.findByIdAndDelete(kategoriaData._id); 

        if (!deletedKategoria) {
            return res.status(404).json({ message: 'Nie znaleziono kategorii o podanym id' });
        }

        res.status(200).json({ message: 'Kategoria została usunięta', deletedKategoria });


    } catch (error) {
        console.error('Błąd podczas usuwania kategorii:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }

});


//enpoint do usuwania peoduktow 

app.delete('/api/usun-przedmiot/:title', async (req, res) => {
    try {
        const {title } = req.params;
        const produktData = await produkt.findOne({ title: title });

        const deletedProdukt = await produkt.findByIdAndDelete(produktData._id); 

        if (!deletedProdukt) {
            return res.status(404).json({ message: 'Nie znaleziono kategorii o podanym id' });
        }

        res.status(200).json({ message: 'Kategoria została usunięta', deletedProdukt });


    } catch (error) {
        console.error('Błąd podczas usuwania kategorii:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }

});

//enpoint do usuwania komentarzy 

app.delete('/api/delete-komentarz/:id', async (req, res) => {
    try {
        const {id } = req.params;

        const deletedComment = await komentarz.findByIdAndDelete(id); 

        if (!deletedComment) {
            return res.status(404).json({ message: 'Nie znaleziono kategorii o podanym id' });
        }

        res.status(200).json({ message: 'Komemntarz została usunięty', deletedComment });


    } catch (error) {
        console.error('Błąd podczas usuwania komentarza:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }

});

//endpoint do dodawania wyszukiwan
app.post('/api/wyszukiwarka', async (req, res) => {
    try {
        const { userId, tresc } = req.body;
        console.log("Otrzymane dane:", req.body);

        const noweWyszukiwanie = new wyszukiwania({ userId, tresc });
        await noweWyszukiwanie.save();

        const liczbaWyszukiwan = await wyszukiwania.countDocuments({ userId });

        if (liczbaWyszukiwan > 3) {
            const najstarszeWyszukiwanie = await wyszukiwania.findOne({ userId }).sort({ _id: 1 });
            if (najstarszeWyszukiwanie) {
                await wyszukiwania.deleteOne({ _id: najstarszeWyszukiwanie._id });
            }
        }
        res.status(201).json({ message: 'Wyszukiwanie zapisane', noweWyszukiwanie });
    } catch (error) {
        console.error('Błąd podczas zapisywania wyszukiwania:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

//endpoint do pobierania wyszukiwan
app.get('/api/wyszukiwanie-pobieranie', async (req, res) => {
    try {
        console.log("Rozpoczęcie pobierania wyszukiwań...");
        const wyszukiwaniaLista = await wyszukiwania.find({}).populate('userId');
        console.log("Wyszukiwania pobrane:", wyszukiwaniaLista);
        res.status(200).json(wyszukiwaniaLista);
    } catch (error) {
        console.error('Błąd podczas pobierania wyszukiwan:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

// Endpoint do wyszukiwania produktów po tytule
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;

        if (!query || query.trim() === '') {
            return res.json([]); // brak zapytania = brak wyników
        }

        const produkty = await produkt.find({
            title: { $regex: query, $options: 'i' } // i ignoruje wielkie litery jak co - poczytac o tym jeszcxze
        });

        res.json(produkty);
    } catch (error) {
        console.error('Błąd podczas wyszukiwania:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

//endpoint do nadawania userowi admina
app.post('/api/nadanie-admina', async (req, res) => {
    try {
        const { username } = req.body;
        console.log("Otrzymane dane:", req.body);
        const user = await uzytkownik.findOne({ login: username });
        if (!user) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika' });
        }
        user.isAdmin = true;
         
        await user.save();

        res.status(200).json({ message: 'Użytkownik został nadany jako admin', user });
    } catch (error) {
        console.error('Błąd podczas nadawania admina:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

