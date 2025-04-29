import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import SearchBar from "./UI_Searchbar";

const TopNav = ({ onChangeView }) => {
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
                    <Button color="inherit" sx={{ fontWeight: "bold" }} onClick={() => onChangeView("cards")}>
                        Inicio
                    </Button>
                    <Button color="inherit" sx={{ fontWeight: "bold" }}>
                        Biblioteca
                    </Button>
                    <Button color="inherit" sx={{ fontWeight: "bold" }}>
                        Estadísticas
                    </Button>
                    <Button color="inherit" sx={{ fontWeight: "bold" }} onClick={() => onChangeView("settings")}>
                        Ajustes
                    </Button>
                </Box>

                <Box sx={{ marginLeft: "auto" }}>
                    <SearchBar />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopNav;
