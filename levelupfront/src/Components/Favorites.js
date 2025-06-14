import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CardContent } from '@mui/material';
import './Favorites.css';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { Link } from 'react-router-dom';

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

  const removeFavorite = async (gameId) => {
    try {
      const res = await fetch(`${baseUrl}/favorites/${gameId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setFavorites(prev => prev.filter(g => g.id !== gameId));
    } catch (err) {
      console.error("Error al eliminar favorito:", err);
    }
  };

  return (
    <Box className="favorites-container">
      <Typography className="favorites-title" gutterBottom variant="h3">
        Mis Favoritos
      </Typography>

      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={2}>
        <div className="favorites-grid">
          {favorites.map(game => (
            <Link
              to={`/game/${game.id}`}
              state={game}
              key={game.id}
              className="favorites-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img src={game.coverUrl || '/fallback.png'} alt={game.name} />
              <CardContent>
                <Typography variant="h6" align="center">{game.name}</Typography>
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.preventDefault(); 
                    removeFavorite(game.id);
                  }}
                >
                  <HeartBrokenIcon fontSize="small" /> Quitar
                </button>
              </CardContent>
            </Link>
          ))}
        </div>
      </Grid>
    </Box>
  );
};

export default Favorites;
