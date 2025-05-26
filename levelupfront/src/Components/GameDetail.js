import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import StarRating from './StarRating';

const baseUrl =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://practicafinal-insoii-levelup.onrender.com';

const GameDetail = ({ game }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const loggedUserId = token ? jwtDecode(token).userId : null;

  // --- Estados para rating y comentarios ---
  const [average, setAverage] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(false);

  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // --- Efecto: al cargar el juego, traemos comentarios y media ---
  useEffect(() => {
    if (!game?.id) return;

    // 1) Comentarios
    fetch(`${baseUrl}/api/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.filter((c) => c.gameId === game.id));
      })
      .catch((err) => console.error('Error cargando comentarios:', err));

    // 2) Media de puntuaciones (sin prefijo /api)
    fetch(`${baseUrl}/games/${game.id}/rating-average`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAverage(Math.round(data.average));
      })
      .catch((err) => console.error('Error cargando media:', err));
  }, [game?.id, token]);

  // --- Función para enviar solo la puntuación ---
  const handleRatingSubmit = async () => {
    if (newRating < 1) return;
    setLoadingRating(true);
    try {
      // POST sin prefijo /api
      await fetch(`${baseUrl}/ratings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            gameId:   game.id,
            score:    newRating,
            gameName: game.name
        }),
        });


      // refrescamos la media (sin /api)
      const res = await fetch(
        `${baseUrl}/games/${game.id}/rating-average`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setAverage(Math.round(data.average));
    } catch (err) {
      console.error('Error enviando rating:', err);
    } finally {
      setLoadingRating(false);
    }
  };

  // --- Funciones de comentarios (igual que antes) ---
  const handleDelete = async (commentId) => {
    // ... tu código de DELETE /api/comments/{id} ...
  };

  const handleEdit = async () => {
    // ... tu código de PUT /api/comments/{id} ...
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert('Por favor, escribe un comentario.');
      return;
    }
    try {
      await fetch(`${baseUrl}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameId: game.id,
          name: game.name,
          content: newComment,
        }),
      });
      // recargo comentarios
      const res = await fetch(`${baseUrl}/api/comments`);
      const data = await res.json();
      setComments(data.filter((c) => c.gameId === game.id));
      setNewComment('');
      alert('¡Gracias por tu comentario!');
    } catch (err) {
      console.error('Error al enviar comentario:', err);
      alert('Error al enviar comentario');
    }
  };

  if (!game) return <Typography>Juego no encontrado</Typography>;

  return (
    <Box p={4}>
      {/* Título + Volver */}
      <Box mb={6} position="relative">
        <Typography variant="h3" fontWeight="bold" textAlign="center">
          {game.name}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          Volver
        </Button>
      </Box>

      {/* Imagen + Storyline */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} mb={4}>
        <Box sx={{ ml: { md: '20%' } }}>
          <img
            src={game.coverUrl}
            alt={game.name}
            style={{ maxWidth: 300, borderRadius: 8 }}
          />
        </Box>
        <Box sx={{ flex: 1, mr: { md: '25%' } }}>
          <Typography variant="body1" sx={{ textAlign: 'justify' }}>
            {game.storyline || 'No hay storyline disponible.'}
          </Typography>
        </Box>
      </Box>

      {/* 1) MEDIA DE PUNTUACIONES */}
      <Box sx={{ ml: { md: '20%' }, mt: 4 }}>
        <Typography variant="h4">Puntuación general</Typography>
        <Box mt={2}>
          <StarRating initialRating={average} readOnly />
        </Box>
        <Typography sx={{ mt: 1 }}>{average} / 5</Typography>
      </Box>

      {/* Plataformas */}
      <Box sx={{ ml: { md: '20%' }, mb: 2 }}>
        <Typography variant="h6">Plataformas:</Typography>
        {game.platformNames?.map((p, i) => (
          <Chip
            key={i}
            label={p}
            sx={{
              mr: 1,
              mt: 1,
              backgroundColor: '#666',
              color: '#fff',
              fontWeight: 'bold',
            }}
          />
        ))}
      </Box>

      {/* Géneros */}
      {game.genreNames?.length > 0 && (
        <Box sx={{ ml: { md: '20%' }, mb: 4 }}>
          <Typography variant="h6">Géneros:</Typography>
          {game.genreNames.map((g, i) => (
            <Chip
              key={i}
              label={g}
              sx={{ mr: 1, mt: 1, backgroundColor: '#555', color: '#fff' }}
            />
          ))}
        </Box>
      )}

      {/* Comentarios */}
      <Box sx={{ ml: { md: '20%' }, mt: 4 }}>
        <Typography variant="h6">Comentarios:</Typography>
        {comments.length > 0 ? (
          comments.map((c) => (
            <Box key={c.id} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {c.username}
              </Typography>
              {editCommentId === c.id ? (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                  <Button onClick={handleEdit} sx={{ mt: 1, mr: 1 }} size="small">
                    Guardar
                  </Button>
                  <Button
                    onClick={() => {
                      setEditCommentId(null);
                      setEditedContent('');
                    }}
                    sx={{ mt: 1 }}
                    size="small"
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {c.content}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {new Date(c.commentedAt).toLocaleString()}
              </Typography>
              {c.userId === loggedUserId && (
                <Box>
                  <Button
                    size="small"
                    sx={{ mt: 1, mr: 1 }}
                    onClick={() => {
                      setEditCommentId(c.id);
                      setEditedContent(c.content);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => handleDelete(c.id)}
                  >
                    Eliminar
                  </Button>
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Aún no hay comentarios.
          </Typography>
        )}
      </Box>

      {/* 2) AÑADIR PUNTUACIÓN */}
      <Box sx={{ ml: { md: '20%' }, mt: 4 }}>
        <Typography variant="h6">Añadir puntuación:</Typography>
        <Box display="flex" alignItems="center" gap={2} mt={1}>
          <Typography>Tu puntuación:</Typography>
          <StarRating initialRating={newRating} onRate={setNewRating} />
          <Typography>{newRating.toFixed(1)} / 5</Typography>
          <Button
            variant="outlined"
            onClick={handleRatingSubmit}
            disabled={loadingRating || newRating < 1}
          >
            {loadingRating ? 'Enviando…' : 'Enviar puntuación'}
          </Button>
        </Box>
      </Box>

      {/* 3) AÑADIR COMENTARIO */}
      <Box sx={{ ml: { md: '20%' }, mt: 4 }}>
        <Typography variant="h6">Añadir comentario:</Typography>
        <TextField
          fullWidth
          label="Tu comentario"
          multiline
          rows={3}
          sx={{ mt: 1, maxWidth: 600 }}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleCommentSubmit}>
          Enviar comentario
        </Button>
      </Box>
    </Box>
  );
};

export default GameDetail;
