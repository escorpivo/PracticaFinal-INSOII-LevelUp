import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip
} from "@mui/material";
import axios from "axios";

const baseUrl = window.location.hostname === "localhost"
  ? "http://localhost:8080"
  : "https://practicafinal-insoii-levelup.onrender.com";

const AddListForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGameIds, setSelectedGameIds] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch(`${baseUrl}/games`);
      const data = await res.json();
      setGames(data);
    };
    fetchGames();
  }, []);

  const handleSubmit = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseUrl}/lists`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const listId = res.data.listId;

      for (const gameId of selectedGameIds) {
        await fetch(`${baseUrl}/lists/${listId}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ gameId })
        });
      }


      setSuccess("Lista creada y juegos añadidos correctamente.");
      setName("");
      setSelectedGameIds([]);
    } catch (err) {
      setError("Error al crear la lista");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Crear nueva lista
      </Typography>

      <TextField
        fullWidth
        label="Nombre de la lista"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="select-juegos-label">Selecciona juegos</InputLabel>
        <Select
          multiple
          value={selectedGameIds}
          onChange={(e) => setSelectedGameIds(e.target.value)}
          input={<OutlinedInput label="Selecciona juegos" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((id) => {
                const game = games.find((g) => g.id === id);
                return <Chip key={id} label={game?.name || id} />;
              })}
            </Box>
          )}
        >
          {games.map((game) => (
            <MenuItem key={game.id} value={game.id}>
              {game.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        CREAR LISTA
      </Button>
    </Box>
  );
};

export default AddListForm;
