import React, { useState, useEffect } from 'react';
import './App.css';
import CardsHolder from './Components/UI_CardsHolder';
import TopNav from "./Components/UI_TopNav";
import Sidebar from "./Components/UI_Sidebar";
import SettingsPage from "./Components/UI_Settings";
import GameDetailWrapper from "./Components/GameDetailWrapper";

import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
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
  } = props;

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <TopNav
        onChangeView={setActiveView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
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
  const [activeView, setActiveView] = useState("cards");
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const darkTheme = createTheme({ palette: { mode: 'dark' } });
  const lightTheme = createTheme({ palette: { mode: 'light' } });

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <Router>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Routes>
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
              >
                {activeView === "cards" && (
                  <CardsHolder
                    darkMode={darkMode}
                    selectedGenre={selectedGenre}
                    selectedPlatform={selectedPlatform}
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
