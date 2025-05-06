import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DevicesIcon from "@mui/icons-material/Devices";
import CategoryIcon from "@mui/icons-material/Category";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";

const GENRE_LIST = [
  "Sin género",
  "Action",
  "Adventure",
  "RPG",
  "Shooter",
  "Strategy",
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
  "PC",
  "PlayStation 4",
  "PlayStation 5",
  "Xbox One",
  "Nintendo Switch",
  "Linux",
  "iOS",
  "Android"
];

const Sidebar = ({
  selectedGenre,
  onGenreChange,
  selectedPlatform,
  onPlatformChange
}) => {
  const [genreAnchorEl, setGenreAnchorEl] = useState(null);
  const [platformAnchorEl, setPlatformAnchorEl] = useState(null);

  const openGenreMenu = Boolean(genreAnchorEl);
  const openPlatformMenu = Boolean(platformAnchorEl);

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
      width="100px"
      sx={{
        bgcolor: (theme) => theme.palette.background.default,
        color: (theme) => theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 1,
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        gap: 1,
      }}
    >
      {/* Filtro por género */}
      <IconButton onClick={handleOpenGenreMenu} title="Filtrar por género">
        <FilterListIcon />
      </IconButton>
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
      <IconButton onClick={handleOpenPlatformMenu} title="Filtrar por plataforma">
        <DevicesIcon />
      </IconButton>
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

      {/* Otros iconos decorativos */}
      <IconButton><CategoryIcon /></IconButton>
      <IconButton><StarIcon /></IconButton>
      <IconButton><AddIcon /></IconButton>
    </Box>
  );
};

export default Sidebar;
