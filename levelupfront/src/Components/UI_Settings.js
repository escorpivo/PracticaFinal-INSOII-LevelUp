import React, { useState } from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    FormControlLabel,
    Switch,
    Button,
    Divider,
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from "@mui/material";

const SettingsPage = () => {
    const [language, setLanguage] = useState("es");
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [autoUpdate, setAutoUpdate] = useState(false);
    const [name, setName] = useState("Example Examplez Examplez");
    const [email, setEmail] = useState("Examplin@example.example");

    const handleSave = () => {
        console.log("Cambios guardados:", {
            language,
            darkMode,
            notifications,
            autoUpdate,
            name,
            email
        });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
                Ajustes
            </Typography>

            <Card elevation={3} sx={{ borderRadius: 3, p: 2, mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Idioma</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="language-select-label">Selecciona idioma</InputLabel>
                        <Select
                            labelId="language-select-label"
                            value={language}
                            label="Selecciona idioma"
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <MenuItem value="es">Español</MenuItem>
                            <MenuItem value="en">Inglés</MenuItem>
                            <MenuItem value="fr">Francés</MenuItem>
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            <Card elevation={3} sx={{ borderRadius: 3, p: 2, mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Temas</Typography>
                    <FormControlLabel
                        control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                        label="Modo oscuro"
                    />
                </CardContent>
            </Card>

            <Card elevation={3} sx={{ borderRadius: 3, p: 2, mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Perfil</Typography>
                    <TextField
                        fullWidth
                        label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </CardContent>
            </Card>

            <Card elevation={3} sx={{ borderRadius: 3, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Notificaciones</Typography>
                    <FormControlLabel
                        control={<Switch checked={notifications} onChange={() => setNotifications(!notifications)} />}
                        label="Recibir notificaciones por correo"
                    />
                    <Divider sx={{ my: 2 }} />
                    <FormControlLabel
                        control={<Switch checked={autoUpdate} onChange={() => setAutoUpdate(!autoUpdate)} />}
                        label="Permitir actualizaciones automáticas"
                    />
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button variant="contained" color="primary" onClick={handleSave} sx={{ borderRadius: 2, px: 4 }}>
                        Guardar cambios
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};

export default SettingsPage;
