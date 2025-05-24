import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';
import GamepadIcon from '@mui/icons-material/SportsEsports';
import { useNavigate } from 'react-router-dom';


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/login', {
        email,
        password
      });

      const token = res.data.token;
      if (!token) throw new Error('No se recibió token');


      localStorage.setItem('token', token);
      onLogin(token);
      navigate('/');

    } catch (err) {
      console.error('Login error:', err);
      setError('Credenciales inválidas');
    }

    navigate('/');

  };

  return (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
            backgroundImage: 'url("/GIF2.gif")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
        }}

        >
        <Paper elevation={6} sx={{ p: 5, width: 500, minHeight: 380, borderRadius: 3 }}>
            <Typography
            variant="h5"
            gutterBottom
            textAlign="center"
            sx={{ fontWeight: 'bold', color: '#333' }}
            >
            Iniciar sesión
            </Typography>
            <form onSubmit={handleSubmit}>
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
            {error && (
                <Typography variant="body2" color="error" mt={1}>
                {error}
                </Typography>
            )}
            <Button
            fullWidth
            type="submit"
            variant="contained"
            startIcon={<GamepadIcon />}
            sx={{
                mt: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                bgcolor: '#4A00E0',
                '&:hover': {
                bgcolor: '#8E2DE2',
                },
                width: 420, minHeight: 70
            }}
            >
            Entrar
            </Button>
            <Typography
                variant="body2"
                textAlign="center"
                mt={3}
                >
                ¿No tienes cuenta?{' '}
                <span
                    style={{ color: '#4A00E0', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => navigate('/register')}
                >
                    ¡Regístrate!
                </span>
            </Typography>

            </form>
            
        </Paper>
    </Box>

  );
};

export default Login;
