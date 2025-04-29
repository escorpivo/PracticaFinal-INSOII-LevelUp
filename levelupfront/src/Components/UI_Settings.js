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
    Box
} from "@mui/material";

const SettingsPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [autoUpdate, setAutoUpdate] = useState(true);

    const handleSave = () => {
        console.log("Guardado:", { darkMode, notifications, autoUpdate });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
                Ajustes
            </Typography>

            <Card elevation={3} sx={{ borderRadius: 3, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Preferencias generales
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                            />
                        }
                        label="Modo oscuro"
                    />

                    <Divider sx={{ my: 2 }} />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={notifications}
                                onChange={() => setNotifications(!notifications)}
                            />
                        }
                        label="Notificaciones por correo"
                    />

                    <Divider sx={{ my: 2 }} />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={autoUpdate}
                                onChange={() => setAutoUpdate(!autoUpdate)}
                            />
                        }
                        label="Actualizaciones automáticas"
                    />
                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        Guardar cambios
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};

export default SettingsPage;
