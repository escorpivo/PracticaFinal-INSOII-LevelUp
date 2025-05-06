import React, { useState, useEffect } from 'react';
import './App.css';
import CardsHolder from './Components/UI_CardsHolder';
import TopNav from "./Components/UI_TopNav";
import Sidebar from "./Components/UI_Sidebar";
import SettingsPage from "./Components/UI_Settings";

import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material";

function App() {
  const [activeView, setActiveView] = useState("cards");
  const [darkMode, setDarkMode] = useState(false);

  const darkTheme = createTheme({ palette: { mode: 'dark' } });
  const lightTheme = createTheme({ palette: { mode: 'light' } });

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div className="App">
        <Box display="flex" flexDirection="column" height="100vh">
          <TopNav onChangeView={setActiveView} />
          <Box display="flex" flexGrow={1}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
              {activeView === "cards" && <CardsHolder darkMode={darkMode} />}
              {activeView === "settings" && (
                <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
