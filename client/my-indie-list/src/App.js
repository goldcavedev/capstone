import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import DarkNavbar from './components/navbar';
import GamesPage from './pages/gamepage';
import WelcomePage from './pages/welcome';
import Footer from './components/footer';
import Loader from './components/loader';
import myLoader from './assets/loader.gif';
import Sidebar from './components/sidebar';
import GameDetails from './pages/gamedetail';
import SignIn from './forms/signin'
import AddGameForm from './forms/gameform';
import FavoritesList from './components/favoritelist';
import SearchPage from './pages/searchpage';
import { ProtectedRouteProvider } from './components/protected';
import { AuthProvider } from './components/authprovider'; // Importa il componente AuthProvider
import Login from './forms/login'; // Importa il componente LoginForm
import ProtectedPage from './components/protectedpage';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5020/games');
        if (!response.ok) {
          throw new Error(`Errore durante la richiesta al server: ${response.status}`);
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleAddToFavorites = (game) => {
    setGames((prevGames) =>
      prevGames.map((g) => (g.title === game.title ? { ...g, isFavorite: true } : g))
    );
  };

  const handleRemoveFromFavorites = async (game) => {
    try {
      await fetch(`http://localhost:5020/games/${game._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: false }),
      });
      setGames((prevGames) =>
        prevGames.map((g) => (g.title === game.title ? { ...g, isFavorite: false } : g))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <AuthProvider>
      <ProtectedRouteProvider>
        <BrowserRouter>
          <DarkNavbar />
          <Sidebar games={games} onRemoveFromFavorites={handleRemoveFromFavorites} />
          {isLoading && <Loader src={myLoader} />}
          {error && <p>{error}</p>}
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<WelcomePage />} />
            <Route
              path="/games"
              element={
                <GamesPage
                  onAddToFavorites={handleAddToFavorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                  games={games}
                />
              }
            />
            <Route path="/protected" element={<ProtectedPage />} />
            <Route path="/favorites" element={<FavoritesList games={games} />} />
            <Route path="/addgameform" element={<AddGameForm />} />
            <Route path="/game/:_id" element={<GameDetails />} />
            <Route path="/search" element={<SearchPage onAddToFavorites={handleAddToFavorites}
              onRemoveFromFavorites={handleRemoveFromFavorites} setGames={setGames} />} />
            <Route path='/login' element={<Login />} />
            <Route path='/sign-in' element={<SignIn />} />
          </Routes>
          <Footer />
        </BrowserRouter>
        </ProtectedRouteProvider>
      </AuthProvider>
    </>
  );
};

export default App;
