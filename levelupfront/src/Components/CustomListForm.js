// src/Components/CustomListForm.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container
} from '@mui/material';

const CustomListForm = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });

      if (!response.ok) throw new Error('Error al crear la lista');
      setName('');
      setDescription('');
      if (onCreate) onCreate();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Crear nueva lista
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre de la lista"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <Button variant="contained" type="submit" fullWidth>
            Crear lista
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CustomListForm;
