import React from "react";
import { Box, IconButton } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';

const Sidebar = () => {
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
            <IconButton><FilterListIcon /></IconButton>
            <IconButton><CategoryIcon /></IconButton>
            <IconButton><StarIcon /></IconButton>
            <IconButton><AddIcon /></IconButton>
        </Box>
    );
};

export default Sidebar;
