import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";

const TopNav = () => {
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar variant="dense">
                <Button color="inherit">Inicio</Button>
                <Button color="inherit">Biblioteca</Button>
                <Button color="inherit">Estadisticas</Button>
                <Button color="inherit">Ajustes</Button>
            </Toolbar>
        </AppBar>   
    );
};

export default TopNav;
