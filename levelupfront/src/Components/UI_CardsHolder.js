import React from "react";
import { Box, Grid } from "@mui/material";
import Card from "./UI_Card";

const baseUrl = window.location.hostname === "localhost"
  ? "http://localhost:8080"
  : "https://practicafinal-insoii-levelup.onrender.com";

// Ahora recibimos favorites y toggleFavorite desde AppContent
const CardsHolder = ({
  darkMode,
  selectedGenre,
  selectedPlatform,
  games,
  favorites,
  toggleFavorite,
}) => {
  console.log("Favorites en CardsHolder:", favorites);

  // Función para marcar como favorito: hace POST y actualiza estado local
  const addToFavorites = async (gameId, name, coverUrl) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${baseUrl}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gameId,
          name,
          coverUrl: coverUrl || "/fallback.png"
        })
      });
      if (!res.ok) throw new Error("Error al guardar favorito");
      // Actualizar estado en la UI
      toggleFavorite(gameId);
      alert("¡Agregado a favoritos!");
    } catch (error) {
      console.error(error);
      alert("No se pudo agregar a favoritos.");
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
              addToFavorites={() => addToFavorites(game.id, game.name, game.coverUrl)}
              isFavorite={favorites.includes(game.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardsHolder;
