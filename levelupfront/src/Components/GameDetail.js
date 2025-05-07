import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const GameDetail = ({ game }) => {
  const navigate = useNavigate();

  if (!game) return <Typography>Juego no encontrado</Typography>;

  // Colores personalizados por plataforma
  const getPlatformColor = (platformName) => {
    const name = platformName.toLowerCase();
    if (name.includes("playstation")) return "#003087";      // Azul
    if (name.includes("xbox")) return "#107C10";              // Verde
    if (name.includes("nintendo")) return "#e60012";          // Rojo
    if (name.includes("windows") || name.includes("pc")) return "#666"; // Gris
    return "#444"; // Color por defecto
  };

  return (
    <Box p={4}>
      {/* Título centrado y botón a la derecha */}
      <Box mb={6} position="relative">
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
        >
          {game.name}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
        >
          Volver
        </Button>
      </Box>

      {/* Imagen y descripción alineadas */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems="flex-start"
        gap={4}
        mb={4}
      >
        <Box sx={{ ml: { md: "20%" }, mt: { xs: 2, md: 0 } }}>
          <img
            src={game.coverUrl}
            alt={game.name}
            style={{
              maxWidth: "300px",
              borderRadius: 8
            }}
          />
        </Box>

        <Box sx={{ mr: { md: "25%" }, mt: { xs: 2, md: 0 }, flex: 1 }}>
          <Typography variant="body1" sx={{ textAlign: "justify" }}>
            {game.storyline}
          </Typography>
        </Box>
      </Box>

      {/* Plataformas */}
      <Box sx={{ ml: { md: "20%" }, mb: 2 }}>
        <Typography variant="h6">Plataformas:</Typography>
        {game.platformNames?.map((p, i) => (
          <Chip
            key={i}
            label={p}
            sx={{
              mr: 1,
              mt: 1,
              backgroundColor: getPlatformColor(p),
              color: "#fff",
              fontWeight: "bold"
            }}
          />
        ))}
      </Box>

      {/* Géneros */}
      {game.genreNames?.length > 0 && (
        <Box sx={{ ml: { md: "20%" } }}>
          <Typography variant="h6">Géneros:</Typography>
          {game.genreNames.map((g, i) => (
            <Chip
              key={i}
              label={g}
              sx={{
                mr: 1,
                mt: 1,
                backgroundColor: "#555",
                color: "#fff",
                fontWeight: "bold"
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default GameDetail;
