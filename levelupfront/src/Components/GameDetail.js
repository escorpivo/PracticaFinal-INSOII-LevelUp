import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const GameDetail = ({ game }) => {
  if (!game) return <Typography>Juego no encontrado</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h3" gutterBottom>{game.name}</Typography>
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
