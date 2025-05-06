import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CategoryIcon from "@mui/icons-material/Category";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";

const Sidebar = ({ selectedGenre, onGenreChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectGenre = (genre) => {
    onGenreChange(genre);
    handleCloseMenu();
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
      <IconButton onClick={handleOpenMenu}>
        <FilterListIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
      >
        <MenuItem
          selected={selectedGenre === ""}
          onClick={() => handleSelectGenre("")}
        >
          Todos
        </MenuItem>
        <MenuItem
          selected={selectedGenre === "Action"}
          onClick={() => handleSelectGenre("Action")}
        >
          Acción
        </MenuItem>
        <MenuItem
          selected={selectedGenre === "Adventure"}
          onClick={() => handleSelectGenre("Adventure")}
        >
          Aventura
        </MenuItem>
        <MenuItem
          selected={selectedGenre === "RPG"}
          onClick={() => handleSelectGenre("RPG")}
        >
          RPG
        </MenuItem>
        <MenuItem
          selected={selectedGenre === "Strategy"}
          onClick={() => handleSelectGenre("Strategy")}
        >
          Estrategia
        </MenuItem>
        <MenuItem
          selected={selectedGenre === "Shooter"}
          onClick={() => handleSelectGenre("Shooter")}
        >
          Shooter
        </MenuItem>
      </Menu>

      <IconButton><CategoryIcon /></IconButton>
      <IconButton><StarIcon /></IconButton>
      <IconButton><AddIcon /></IconButton>
    </Box>
  );
};

export default Sidebar;
