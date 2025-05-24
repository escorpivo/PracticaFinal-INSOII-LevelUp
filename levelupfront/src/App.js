// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import CardsHolder from './Components/UI_CardsHolder';
import TopNav from "./Components/UI_TopNav";
import Sidebar from "./Components/UI_Sidebar";
import SettingsPage from "./Components/UI_Settings";
import GameDetailWrapper from "./Components/GameDetailWrapper";
import Login from './Components/Login';
import Register from './Components/Register';

import { Box, ThemeProvider, createTheme, CssBaseline, LinearProgress } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

  const darkTheme = createTheme({ palette: { mode: 'dark' } });
  const lightTheme = createTheme({ palette: { mode: 'light' } });
  const [token, setToken] = useState('');


  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Intentar primero en localhost
        const res = await fetch("http://localhost:8080/games");
        if (!res.ok) throw new Error("Localhost no responde");
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.warn("Fallo en localhost, probando con Render...");
        try {
          const res = await fetch("https://practicafinal-insoii-levelup.onrender.com/games");
          const data = await res.json();
          console.log("Desde Render:", data);
          setGames(data);
        } catch (err2) {
          console.error("Error al cargar juegos desde Render:", err2);
        }
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
          <Route path="/login" element={<Login onLogin={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
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
            }
          />
          <Route
            path="/game/:id"
            element={
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
                {activeView === "settings" ? (
                  <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                ) : (
                  <GameDetailWrapper />
                )}
              </MainLayout>
            }
          />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
