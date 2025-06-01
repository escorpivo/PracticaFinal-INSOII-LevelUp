import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DevicesIcon from "@mui/icons-material/Devices";
import CategoryIcon from "@mui/icons-material/Category";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const GENRE_LIST = [
  "Sin género",
  "Action",
  "Adventure",
  "Role-playing (RPG)",
  "Turn-based strategy (TBS)",
  "Point-and-click",
  "Shooter",
  "Strategy",
  "Shooter",
  "Racing",
  "Sport",
  "Platform",
  "Indie",
  "Puzzle",
  "Visual Novel",
  "Fighting",
  "Simulator",
  "Card & Board Game"
];

const PLATFORM_LIST = [
  "Desconocida",
  "PC (Microsoft Windows)",
  "PlayStation 2",
  "PlayStation 3",
  "PlayStation 4",
  "PlayStation 5",
  "Xbox 360",
  "Xbox One",
  "Wii U",
  "Nintendo Entertainment System",
  "Nintendo Switch",
  "Linux",
  "iOS",
  "Android"
];

const Sidebar = ({
  selectedGenre,
  onGenreChange,
  selectedPlatform,
  onPlatformChange,
  onLogout
}) => {
  const [genreAnchorEl, setGenreAnchorEl] = useState(null);
  const [platformAnchorEl, setPlatformAnchorEl] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const openGenreMenu = Boolean(genreAnchorEl);
  const openPlatformMenu = Boolean(platformAnchorEl);
  const navigate = useNavigate();

  const handleOpenGenreMenu = (event) => setGenreAnchorEl(event.currentTarget);
  const handleCloseGenreMenu = () => setGenreAnchorEl(null);
  const handleSelectGenre = (genre) => {
    onGenreChange(genre);
    handleCloseGenreMenu();
  };

  const handleOpenPlatformMenu = (event) => setPlatformAnchorEl(event.currentTarget);
  const handleClosePlatformMenu = () => setPlatformAnchorEl(null);
  const handleSelectPlatform = (platform) => {
    onPlatformChange(platform);
    handleClosePlatformMenu();
  };

  return (
    <Box
      sx={{
        width: isExpanded ? 240 : 100,
        bgcolor: (theme) => theme.palette.background.default,
        color: (theme) => theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: isExpanded ? "flex-start" : "center",
        paddingY: 2,
        paddingX: isExpanded ? 2 : 0,
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        gap: 1,
        transition: "width 0.3s ease",
      }}
    >
      {/* Botón expandir/colapsar */}
      <Box width="100%" display="flex" justifyContent={isExpanded ? "flex-end" : "center"}>
        <IconButton onClick={() => setIsExpanded((prev) => !prev)}>
          {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* Filtro por género */}
      <Box width="100%" display="flex" alignItems="center" gap={1}>
        <IconButton onClick={handleOpenGenreMenu} title="Filtrar por género">
          <FilterListIcon />
        </IconButton>
        {isExpanded && <Typography variant="body2">Género</Typography>}
      </Box>
      <Menu
        anchorEl={genreAnchorEl}
        open={openGenreMenu}
        onClose={handleCloseGenreMenu}
      >
        <MenuItem
          selected={selectedGenre === ""}
          onClick={() => handleSelectGenre("")}
        >
          Todos
        </MenuItem>
        {GENRE_LIST.map((genre) => (
          <MenuItem
            key={genre}
            selected={selectedGenre === genre}
            onClick={() => handleSelectGenre(genre)}
          >
            {genre}
          </MenuItem>
        ))}
      </Menu>

      {/* Filtro por plataforma */}
      <Box width="100%" display="flex" alignItems="center" gap={1}>
        <IconButton onClick={handleOpenPlatformMenu} title="Filtrar por plataforma">
          <DevicesIcon />
        </IconButton>
        {isExpanded && <Typography variant="body2">Plataforma</Typography>}
      </Box>
      <Menu
        anchorEl={platformAnchorEl}
        open={openPlatformMenu}
        onClose={handleClosePlatformMenu}
      >
        <MenuItem
          selected={selectedPlatform === ""}
          onClick={() => handleSelectPlatform("")}
        >
          Todas
        </MenuItem>
        {PLATFORM_LIST.map((platform) => (
          <MenuItem
            key={platform}
            selected={selectedPlatform === platform}
            onClick={() => handleSelectPlatform(platform)}
          >
            {platform}
          </MenuItem>
        ))}
      </Menu>

      <Divider sx={{ width: "100%", my: 1 }} />

      {/* Otros iconos decorativos */}
      <Box width="100%" display="flex" alignItems="center" gap={1}>
        <IconButton><CategoryIcon /></IconButton>
        {isExpanded && <Typography variant="body2">Categoría</Typography>}
      </Box>
      <Box width="100%" display="flex" alignItems="center" gap={1}>
        <IconButton onClick={() => navigate('/favorites')} title="Ir a favoritos">
          <StarIcon />
        </IconButton>
        {isExpanded && <Typography variant="body2">Favoritos</Typography>}
      </Box>
      <Box width="100%" display="flex" alignItems="center" gap={1}>
        <IconButton onClick={() => navigate('/add-list')} title="Ir a crear lista">
          <AddIcon />
        </IconButton>
        {isExpanded && <Typography variant="body2">Añadir</Typography>}
      </Box>

      {/* Boton logout */}
      <Box width="100%" display="flex" alignItems="center" gap={1} justifyContent={isExpanded ? "flex-start" : "center"} px={2} pb={2}>
        <IconButton onClick={onLogout} title="Cerrar sesión">
          <LogoutIcon />
        </IconButton>
        {isExpanded && <Typography variant="body2">Cerrar sesión</Typography>}
      </Box>
    </Box>
  );
};

export default Sidebar;
