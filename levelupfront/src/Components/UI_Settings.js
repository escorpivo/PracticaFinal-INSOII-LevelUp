import React from "react";
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
  FormControl,
} from "@mui/material";

const SettingsPage = ({ darkMode, setDarkMode }) => {
  const [language, setLanguage] = React.useState("es");
  const [notifications, setNotifications] = React.useState(true);
  const [autoUpdate, setAutoUpdate] = React.useState(false);
  const [name, setName] = React.useState("Example Examplez Examplez");
  const [email, setEmail] = React.useState("Examplin@example.example");

  const handleSave = () => {
    console.log("Cambios guardados:", {
      language,
      darkMode,
      notifications,
      autoUpdate,
      name,
      email,
    });
  };

  const handleClearCache = () => {
    if (window.caches) { // Borrar caches del Service Worker si existen
      caches.keys().then(names =>
        names.forEach(name => caches.delete(name))
      );
    }
    localStorage.clear(); // Borrar caches del Service Worker si existen
    sessionStorage.clear();
    window.location.reload();  // Recargar la página para aplicar cambios
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
        Ajustes
      </Typography>


      <Card elevation={3} sx={{ borderRadius: 3, p: 2, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Temas
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
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ borderRadius: 3, p: 2, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Perfil
          </Typography>
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
          <Typography variant="h6" gutterBottom>
            Caché de la aplicación
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Borra la caché local para liberar espacio y asegurar datos frescos.
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearCache}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Limpiar caché
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SettingsPage;
