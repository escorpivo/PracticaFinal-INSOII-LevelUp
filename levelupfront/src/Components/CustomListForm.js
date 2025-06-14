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
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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

      // Crear lista y añadir juegos en un solo paso
      await axios.post(`${baseUrl}/lists`, {
        name,
        games: selectedGameIds.map(id => {
          const game = games.find(g => g.id === id);
          return { id: game.id, name: game.name };
        })
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess("Lista creada correctamente.");
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

      <Button
        fullWidth
        variant="outlined"
        onClick={() => navigate('/my-lists')}
        sx={{ mt: 2 }}
      >
        Ver listas creadas
      </Button>
    </Box>
  );
};

export default AddListForm;
