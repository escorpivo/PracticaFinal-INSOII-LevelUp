import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const baseUrl = window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://practicafinal-insoii-levelup.onrender.com";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${baseUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: name,
        email,
        password
      })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Error en el registro');
    }

    // 👇 login automático tras registro
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json();
    localStorage.setItem('token', loginData.token);
    navigate('/');

  } catch (error) {
    console.error('Error en el registro:', error);
    alert(error.message || 'No se pudo registrar. Intenta de nuevo.');
  }
};




  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
         backgroundImage: 'url(./portadaRegister.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold">
          Crear cuenta
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Nombre"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Correo electrónico"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2, bgcolor: '#4A00E0', '&:hover': { bgcolor: '#8E2DE2' } }}
          >
            Registrarse
          </Button>
        </form>
        <Typography variant="body2" textAlign="center" mt={2}>
          ¿Ya tienes cuenta?{' '}
          <span
            style={{ color: '#4A00E0', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Inicia sesión
          </span>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
