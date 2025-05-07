import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const GameDetail = ({ game }) => {
  const navigate = useNavigate();

  if (!game) return <Typography>Juego no encontrado</Typography>;

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h3">{game.name}</Typography>
        <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
        >
            Volver
        </Button>
    </Box>

      <img src={game.coverUrl} alt={game.name} style={{ maxWidth: "300px", borderRadius: 8 }} />
      <Typography variant="body1" sx={{ mt: 2 }}>{game.storyline}</Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Plataformas:</Typography>
        {game.platformNames?.map((p, i) => (
          <Chip key={i} label={p} sx={{ mr: 1, mt: 1 }} />
        ))}
      </Box>
    </Box>
  );
};

export default GameDetail;
