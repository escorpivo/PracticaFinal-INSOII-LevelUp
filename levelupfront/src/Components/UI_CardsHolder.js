import React from "react";
import { Box, Grid } from "@mui/material";
import Card from "./UI_Card";

const CardsHolder = ({ darkMode, selectedGenre, selectedPlatform, games }) => {
  // Filtramos los juegos según género y plataforma
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
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardsHolder;
