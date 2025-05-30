import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress
} from '@mui/material';
import StarRating from './StarRating';

const baseUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://practicafinal-insoii-levelup.onrender.com';

const Library = ({ token }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Cargo la biblioteca
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await axios.get(`${baseUrl}/library`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const lib = Array.isArray(res.data) ? res.data : [];

        // 2️⃣ Por cada juego pido la media de puntuaciones
        const withAvg = await Promise.all(lib.map(async game => {
          const avgRes = await axios.get(
            `${baseUrl}/games/${game.id}/rating-average`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return {
            ...game,
            average: avgRes.data.average
          };
        }));

        setGames(withAvg);
      } catch (err) {
        console.error('Error al cargar la biblioteca:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [token]);

  // 3️⃣ Función para quitar de biblioteca
  const handleRemove = async (gameId) => {
    try {
      await axios.delete(`${baseUrl}/library/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGames(g => g.filter(x => x.id !== gameId));
    } catch (err) {
      console.error('Error al quitar de biblioteca:', err);
      alert('No se pudo quitar el juego de tu biblioteca');
    }
  };

  if (loading) {
    return (
      <Box p={3} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tu Biblioteca
      </Typography>

      {games.length === 0 ? (
        <Typography variant="body1">
          Aún no has añadido ningún juego a tu biblioteca.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {games.map(game => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="280"
                  // ← aquí usamos coverUrl que manda el backend
                  image={game.coverUrl}
                  alt={game.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {game.name}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <StarRating initialRating={Math.round(game.average)} readOnly />
                    <Typography sx={{ ml: 1 }}>
                      {game.average.toFixed(1)} / 5
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemove(game.id)}
                  >
                    Quitar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Library;
