import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    console.log('Registrando usuario:', { name, email, password });
    navigate('/login');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
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
