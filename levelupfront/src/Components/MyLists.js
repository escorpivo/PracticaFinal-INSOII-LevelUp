import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const baseUrl = window.location.hostname === "localhost"
  ? "http://localhost:8080"
  : "https://practicafinal-insoii-levelup.onrender.com";

const MyLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${baseUrl}/lists`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Asegurar que cada lista tiene un array de juegos
        const parsed = res.data.map((list) => ({
          ...list,
          games: Array.isArray(list.games) ? list.games : []
        }));
        setLists(parsed);
      } catch (err) {
        console.error("Error fetching lists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Mis listas</Typography>
      {lists.length === 0 ? (
        <Typography>No tienes listas creadas.</Typography>
      ) : (
        lists.map((list) => (
          <Accordion key={list.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="h6">{list.name}</Typography>
                <Typography variant="body2">Juegos: {list.games.length}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {list.games.length > 0 ? (
                <List dense>
                  {list.games.map((game) => (
                    <ListItem key={game.id}>
                      <ListItemText primary={game.name} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Esta lista no contiene juegos.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default MyLists;
