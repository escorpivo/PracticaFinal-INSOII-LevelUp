import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid } from "@mui/material";
import Card from "./UI_Card";

const CardsHolder = ({ selectedGenre, selectedPlatform }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8080/games")
      .then((response) => {
        setGames(response.data);
        console.log("Datos recibidos:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  }, []);

  const filteredGames = games.filter((game) => {
    const matchesGenre = selectedGenre
      ? game.genreNames?.includes(selectedGenre)
      : true;
    const matchesPlatform = selectedPlatform
      ? game.platformNames?.includes(selectedPlatform)
      : true;
    return matchesGenre && matchesPlatform;
  });

  return (
    <Box p={2} sx={{ flexGrow: 1, width: "100%" }}>
      <Grid container spacing={1}>
        {filteredGames.map((game, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              nombre={game.name}
              descripcion={game.storyline ?? "No disponible"}
              imagen={game.coverUrl}
              rating={game.rating}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardsHolder;
