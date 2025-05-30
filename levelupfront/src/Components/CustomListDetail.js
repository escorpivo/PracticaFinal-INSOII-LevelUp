import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper
} from "@mui/material";

const baseUrl = window.location.hostname === "localhost"
  ? "http://localhost:8080"
  : "https://practicafinal-insoii-levelup.onrender.com";

const CustomListDetail = () => {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {

        if (!id) {
  console.error("ID de la lista no definido");
  return;
}

        const token = localStorage.getItem("token");
        console.log("TOKEN:", token); 

        const res = await fetch(`${baseUrl}/lists/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });

        if (!token) {
            console.error("No hay token disponible");
            return;
        }

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("Respuesta no válida del servidor");
        }

        const data = await res.json();
        setList(data);
      } catch (error) {
        console.error("Error cargando lista:", error);
        setList(null);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [id]);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!list) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          Error al cargar la lista
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Lista: {list.name}
      </Typography>

      <Grid container spacing={2}>
       {Array.isArray(list.games) && list.games.map((game) => (
          <Grid item key={game.id} xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight="bold">{game.name}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CustomListDetail;
