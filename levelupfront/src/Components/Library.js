import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider
} from '@mui/material';

const baseUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://practicafinal-insoii-levelup.onrender.com';

const Library = ({ token }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await axios.get(`${baseUrl}/library`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        const result = Array.isArray(res.data) ? res.data : [];
        setGames(result);

      } catch (err) {
        console.error('Error al cargar la biblioteca:', err);
      }
    };

    fetchLibrary();
  }, [token]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tu Biblioteca
      </Typography>
      {games.length === 0 ? (
        <Typography variant="body1">Todavía no has puntuado ningún juego.</Typography>
      ) : (
        <Paper elevation={3}>
          <List>
            {games.map((game) => (
              <React.Fragment key={game.id}>
                <ListItem>
                  <ListItemText
                    primary={game.name}
                    secondary={`Puntuación: ${game.score}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Library;