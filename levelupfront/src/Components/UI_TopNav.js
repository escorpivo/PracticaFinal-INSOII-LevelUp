import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import SearchBar from "./UI_Searchbar";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";


const TopNav = ({ onChangeView, onSearch, resetToHome, searchQuery }) => {
    const navigate = useNavigate();

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar
                variant="dense"
                sx={{
                    minHeight: 72,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 4
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: 3,
                    }}
                >
                    <Button
                        color="inherit"
                        sx={{ fontWeight: "bold" }}
                        onClick={() => {
                            onChangeView("cards");
                            navigate("/home");
                        }}
                    >
                        Inicio
                    </Button>
                    <Button
                    color="inherit"
                    sx={{ fontWeight: "bold" }}
                    onClick={() => navigate('/library')}
                    >
                    Biblioteca
                    </Button>
                    <Button color="inherit" sx={{ fontWeight: "bold" }}>
                        Comentarios
                    </Button>
                    <Button
                        color="inherit"
                        sx={{ fontWeight: "bold" }}
                        onClick={() => {
                            onChangeView("settings");
                            navigate("/home");
                        }}
                    >
                        Ajustes
                    </Button>
                </Box>

                <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 1 }}>
                    <SearchBar
                        onSearch={onSearch}
                        searchQuery={searchQuery}
                        resetToHome={resetToHome}
                    />
                </Box>


            </Toolbar>
        </AppBar>
    );
};

export default TopNav;
