import React from "react";
import { Box, Grid } from "@mui/material";
import Card from "./UI_Card";

const CardsHolder = ({ darkMode, selectedGenre, selectedPlatform, games }) => {
  // Función para marcar como favorito
  const addToFavorites = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameId })
      });

      if (!res.ok) throw new Error("Error al guardar favorito");

      alert("¡Agregado a favoritos!");
    } catch (err) {
      console.error(err);
    }
  };

  // Filtrar juegos por género y plataforma
  const filteredGames = games.filter(game => {
    const matchesGenre =
      selectedGenre === "" ||
      (selectedGenre === "Sin género"
        ? (game.genreNames?.length ?? 0) === 0
        : game.genreNames?.includes(selectedGenre));

    const matchesPlatform =
      selectedPlatform === "" ||
      game.platformNames?.includes(selectedPlatform);

    return matchesGenre && matchesPlatform;
  });

  return (
    <Box p={4}>
      <Grid container spacing={2}>
        {filteredGames.map(game => (
          <Grid item key={game.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              id={game.id}
              nombre={game.name}
              descripcion={game.storyline ?? "Descripción no disponible"}
              imagen={game.coverUrl}
              rating={game.rating}
              darkMode={darkMode}
              addToFavorites={addToFavorites} // 💥 aquí se pasa la función
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardsHolder;
