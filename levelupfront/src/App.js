import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CardsHolder from './Components/UI_CardsHolder';
import TopNav from "./Components/UI_TopNav";
import Sidebar from "./Components/UI_Sidebar";
import SettingsPage from "./Components/UI_Settings";
import GameDetailWrapper from "./Components/GameDetailWrapper";
import Login from './Components/Login';
import Register from './Components/Register';
import { Box, ThemeProvider, createTheme, CssBaseline, LinearProgress } from "@mui/material";

const baseUrl = window.location.hostname === "localhost"
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
    onSearch
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
        />
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("cards");
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const darkTheme = createTheme({ palette: { mode: 'dark' } });
  const lightTheme = createTheme({ palette: { mode: 'light' } });

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`${baseUrl}/games`);
        if (!res.ok) throw new Error("Error al cargar juegos");
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.error("Error al cargar juegos:", err);
      }
    };

    fetchGames();
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveView("cards");
  };

  return (
    <Router>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {loading && <LinearProgress />}
        <Routes>
          {/* Redirección inicial */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Login y Registro */}
          <Route path="/login" element={<Login onLogin={setToken} />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
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
              >
                {activeView === "cards" && (
                  <CardsHolder
                    darkMode={darkMode}
                    selectedGenre={selectedGenre}
                    selectedPlatform={selectedPlatform}
                    games={games}
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
              >
                  <GameDetailWrapper />
              </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
