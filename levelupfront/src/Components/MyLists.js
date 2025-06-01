import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, CircularProgress } from "@mui/material";

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
        setLists(res.data);
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
          <Card key={list.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{list.name}</Typography>
              <Typography variant="body2">Juegos: {list.games?.length || 0}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MyLists;
