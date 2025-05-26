import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const baseUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://practicafinal-insoii-levelup.onrender.com';

const Favorites = ({ token }) => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${baseUrl}/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Error al cargar favoritos");

        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudieron cargar los favoritos.");
      }
    };

    fetchFavorites();
  }, [token]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Mis Favoritos</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={2}>
        {favorites.map(game => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <Card>
              <img src={game.coverUrl || '/fallback.png'} alt={game.name} style={{ width: '100%' }} />
              <CardContent>
                <Typography variant="h6">{game.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Favorites;
