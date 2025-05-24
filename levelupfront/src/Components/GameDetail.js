import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import StarRating from "./StarRating";
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { jwtDecode } from "jwt-decode";

const baseUrl = window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://practicafinal-insoii-levelup.onrender.com";


const GameDetail = ({ game }) => {
    const navigate = useNavigate();
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);

    //para el put de comentarios
    const [editCommentId, setEditCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");


    const token = localStorage.getItem("token");
    const loggedUserId = token ? jwtDecode(token).userId : null;


    //eliminación de comentarios
    const handleDelete = async (commentId) => {
        try {
            await fetch(`${baseUrl}/api/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const res = await fetch(`${baseUrl}/api/comments`);
            const data = await res.json();
            const filtered = data.filter(c => c.gameId === game.id);
            setComments(filtered);
        } catch (err) {
            console.error("Error al eliminar comentario:", err);
            alert("No se pudo eliminar el comentario.");
        }
    };


    //edit de comentarios
    const handleEdit = async () => {
        try {
            await fetch(`${baseUrl}/api/comments/${editCommentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: editedContent,
                    gameId: game.id, // requerido por el backend
                }),
            });

            setEditCommentId(null);
            setEditedContent("");

            const res = await fetch(`${baseUrl}/api/comments`);
            const data = await res.json();
            const filtered = data.filter(c => c.gameId === game.id);
            setComments(filtered);
        } catch (err) {
            console.error("Error al editar comentario:", err);
            alert("Error al editar el comentario");
        }
    };

    // Colores personalizados por plataforma
    const getPlatformColor = (platformName) => {
        const name = platformName.toLowerCase();
        if (name.includes("playstation")) return "#003087";      // Azul
        if (name.includes("xbox")) return "#107C10";              // Verde
        if (name.includes("nintendo")) return "#e60012";          // Rojo
        if (name.includes("windows") || name.includes("pc")) return "#666"; // Gris
        return "#444"; // Color por defecto
    };


    useEffect(() => {
        if (!game?.id) return;

        fetch(`${baseUrl}/api/comments`)
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter(c => c.gameId === game.id);
                setComments(filtered);
            })
            .catch(err => console.error("Error al cargar comentarios:", err));
    }, [game?.id]);




    if (!game) return <Typography>Juego no encontrado</Typography>;


    return (
        <Box p={4}>
            {/* Título centrado y botón a la derecha */}
            <Box mb={6} position="relative">
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    textAlign="center"
                >
                    {game.name}
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    sx={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                >
                    Volver
                </Button>
            </Box>

            {/* Imagen y descripción alineadas */}
            <Box
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                alignItems="flex-start"
                gap={4}
                mb={4}
            >
                <Box sx={{ ml: { md: "20%" }, mt: { xs: 2, md: 0 } }}>
                    <img
                        src={game.coverUrl}
                        alt={game.name}
                        style={{
                            maxWidth: "300px",
                            borderRadius: 8
                        }}
                    />
                </Box>

                <Box sx={{ mr: { md: "25%" }, mt: { xs: 2, md: 0 }, flex: 1 }}>
                    <Typography variant="body1" sx={{ textAlign: "justify" }}>
                        {game.storyline}
                    </Typography>
                </Box>
            </Box>

            {/* Rating del juego */}
            <Box sx={{ ml: { md: "20%" }, mt: 4 }}>
                <Typography variant="h4">Puntuación general</Typography>

                <Box mt={2}>
                    <StarRating
                        value={game.averageRating}
                        precision={0.5} // o 0.1 si quieres más fino
                        readOnly
                    />
                </Box>
            </Box>

            {/* Plataformas */}
            <Box sx={{ ml: { md: "20%" }, mb: 2 }}>
                <Typography variant="h6">Plataformas:</Typography>
                {game.platformNames?.map((p, i) => (
                    <Chip
                        key={i}
                        label={p}
                        sx={{
                            mr: 1,
                            mt: 1,
                            backgroundColor: getPlatformColor(p),
                            color: "#fff",
                            fontWeight: "bold"
                        }}
                    />
                ))}
            </Box>

            {/* Géneros */}
            {game.genreNames?.length > 0 && (
                <Box sx={{ ml: { md: "20%" } }}>
                    <Typography variant="h6">Géneros:</Typography>
                    {game.genreNames.map((g, i) => (
                        <Chip
                            key={i}
                            label={g}
                            sx={{
                                mr: 1,
                                mt: 1,
                                backgroundColor: "#555",
                                color: "#fff",
                                fontWeight: "bold"
                            }}
                        />
                    ))}
                </Box>
            )}

            {/* Comentarios */}
            <Box sx={{ ml: { md: "20%" }, mt: 4 }}>
                <Typography variant="h6">Comentarios:</Typography>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <Box key={index} sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold">{comment.username}</Typography>

                            {/* con esto convertimos el comentario en un campo editable */}
                            {editCommentId === comment.id ? (
                                <>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        sx={{ mt: 1 }}/>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        sx={{ mt: 1, mr: 1 }}
                                        onClick={handleEdit}>
                                        Guardar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="secondary"
                                        sx={{ mt: 1 }}
                                        onClick={() => {
                                            setEditCommentId(null);
                                            setEditedContent("");
                                        }}>
                                        Cancelar
                                    </Button>
                                </>
                            ) : (
                                <Typography variant="body2" sx={{ mt: 1 }}>{comment.content}</Typography>
                            )}

                            <Typography variant="caption" color="text.secondary">
                                {new Date(comment.commentedAt).toLocaleString()}
                            </Typography>
                            {/* parte para eliminar o editar comentarios y que solo pueda el usuario que lo creó */}
                            {comment.userId === loggedUserId && (
                                <>
                                    {/* botón editar */}
                                    <Button
                                        size="small"
                                        sx={{ mt: 1, mr: 1 }}
                                        onClick={() => {
                                            setEditCommentId(comment.id);
                                            setEditedContent(comment.content);
                                        }}
                                    >
                                        Editar
                                    </Button>

                                    {/* botón eliminar */}
                                    <Button
                                        size="small"
                                        color="error"
                                        sx={{ mt: 1 }}
                                        onClick={() => handleDelete(comment.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </>
                            )}
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ mt: 1 }}>Aún no hay comentarios.</Typography>
                )}

            </Box>
            <Box sx={{ ml: { md: "20%" }, mt: 4 }}>
                <Typography variant="h6">Añadir valoración:</Typography>

                <Box display="flex" alignItems="center" gap={2} mt={1}>
                    <Typography>Tu puntuación:</Typography>
                    <Box mt={2}>
                        <StarRating
                            initialRating={newRating}
                            onRate={(val) => setNewRating(val)}
                        />
                    </Box>

                    <Typography>{newRating.toFixed(1)} / 5</Typography>
                </Box>

                <TextField
                    fullWidth
                    label="Tu comentario"
                    multiline
                    rows={3}
                    sx={{ mt: 2, maxWidth: "600px" }}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />

                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={async () => {
                        if (newComment.trim()) {
                            const token = localStorage.getItem("token");

                            try {
                                await fetch(`${baseUrl}/api/comments`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({
                                        gameId: game.id,
                                        content: newComment,
                                    }),
                                });

                                const res = await fetch(`${baseUrl}/api/comments`);
                                const data = await res.json();
                                const filtered = data.filter(c => c.gameId === game.id);
                                setComments(filtered);

                                setNewComment("");
                                alert("¡Gracias por tu comentario!");
                            } catch (err) {
                                console.error("Error al enviar comentario:", err);
                                alert("Error al enviar comentario");
                            }
                        } else {
                            alert("Por favor, escribe un comentario.");
                        }
                    }}
                >
                    Enviar valoración
                </Button>
            </Box>


        </Box>
    );
};

export default GameDetail;