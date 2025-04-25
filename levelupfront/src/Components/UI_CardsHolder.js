import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid } from "@mui/material";
import Card  from "./UI_Card";

const CardsHolder = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        // Hacer una solicitud GET al backend en http://127.0.0.1:5000/games
        axios.get("http://127.0.0.1:8080/games")
            .then((response) => {
                setGames(response.data); // Guardar los juegos en el estado
                console.log("Datos recibidos:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching games:", error);
            });
    }, []);

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px",
    };

    return (
        <Box p={2} sx={{ flexGrow: 1, width: "100%" }}>
            <Grid container spacing={1}>
                {games.map((game, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card
                            nombre={game.name}
                            descripcion={game.storyline ?? "No disponible"}
                            imagen={game.coverUrl}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default CardsHolder;