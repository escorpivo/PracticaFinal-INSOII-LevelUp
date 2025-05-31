import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import './App.css';
import CardsHolder from './Components/UI_CardsHolder';
import TopNav from "./Components/UI_TopNav";
import Sidebar from "./Components/UI_Sidebar";
import SettingsPage from "./Components/UI_Settings";
import GameDetailWrapper from "./Components/GameDetailWrapper";
import Login from './Components/Login';
import Register from './Components/Register';
import Library from './Components/Library'; 
import Favorites from './Components/Favorites';
import CustomListForm from "./Components/CustomListForm";
import CustomListDetail from './Components/CustomListDetail';



import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  LinearProgress
} from "@mui/material";

const isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
const baseUrl = isLocal
  ? "http://localhost:8080"
  : "https://practicafinal-insoii-levelup.onrender.com";


function MainLayout(props) {
  const {
    children,
    activeView,
    setActiveView,
    darkMode,
    setDarkMode,
    selectedGenre,
    setSelectedGenre,
    selectedPlatform,
    setSelectedPlatform,
    onSearch,
    onLogout,
  } = props;

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <TopNav
        onChangeView={setActiveView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSearch={onSearch}
      />
      <Box display="flex" flexGrow={1}>
        <Sidebar
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          onLogout={onLogout}
        />
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [activeView, setActiveView] = useState("cards");
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [favorites, setFavorites] = useState([]);

  const darkTheme = createTheme({ palette: { mode: 'dark' } });
  const lightTheme = createTheme({ palette: { mode: 'light' } });

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setPage(0);
    }
  }, [searchQuery]);

  // Cargar favoritos al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${baseUrl}/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        const favoriteIds = data.map(f => f.id);
        setFavorites(favoriteIds);
      })

      .catch((err) => console.error("Error al cargar favoritos:", err));
  }, [token]);

  // Cargar juegos
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`${baseUrl}/games?page=${page}`);
        if (!res.ok) throw new Error("Error al cargar juegos");
        const data = await res.json();

        setGames(data);
      } catch (err) {
        console.error("Error al cargar juegos:", err);
      }
    };
    fetchGames();
  }, [page]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveView("cards");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');
  };

  const toggleFavorite = async (gameId) => {
    const isFav = favorites.includes(gameId);

    try {
      if (isFav) {
        // eliminar favorito
        const res = await fetch(`${baseUrl}/favorites/${gameId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al eliminar favorito");

        setFavorites((prev) => prev.filter((id) => id !== gameId));

      } else {
        // añadir favorito
        const game = games.find((g) => g.id === gameId);
        if (!game) throw new Error("Juego no encontrado");

        const res = await fetch(`${baseUrl}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            gameId: game.id,
            name: game.name,
            coverUrl: game.coverUrl || "/fallback.png",
          }),
        });

        if (!res.ok) throw new Error("Error al añadir favorito");

        setFavorites((prev) => [...prev, gameId]);
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {loading && <LinearProgress />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            token ? (
              <MainLayout
                activeView={activeView}
                setActiveView={setActiveView}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
                onSearch={handleSearch}
                onLogout={handleLogout}
              >
                {activeView === "cards" && (
                  <CardsHolder
                    key={`page-${page}`}
                    darkMode={darkMode}
                    selectedGenre={selectedGenre}
                    selectedPlatform={selectedPlatform}
                    games={games}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    page={page}
                    setPage={setPage}
                  />
                )}
                {activeView === "settings" && (
                  <SettingsPage
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  />
                )}
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/game/:id"
          element={
            token ? (
              <MainLayout
                activeView={activeView}
                setActiveView={setActiveView}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
                onSearch={handleSearch}
                onLogout={handleLogout}
              >
                <GameDetailWrapper games={games} />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/library"
          element={
            token ? (
              <MainLayout
                activeView={activeView}
                setActiveView={setActiveView}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
                onSearch={handleSearch}
                onLogout={handleLogout}
              >
                <Library token={token} />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/favorites"
          element={
            token ? (
              <MainLayout
                activeView={activeView}
                setActiveView={setActiveView}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
                onSearch={handleSearch}
                onLogout={handleLogout}
              >
                <Favorites token={token} />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add-list"
          element={
            token ? (
              <MainLayout
                activeView={activeView}
                setActiveView={setActiveView}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
                onSearch={handleSearch}
                onLogout={handleLogout}
              >
                <CustomListForm token={token} />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/lists/:id"
          element={
            token ? (
              <MainLayout
                activeView={activeView}
                setActiveView={setActiveView}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
                onSearch={handleSearch}
                onLogout={handleLogout}
              >
                <CustomListDetail />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
