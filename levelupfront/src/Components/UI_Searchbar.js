import React, { useState, useEffect } from "react";
import {Box, TextField, InputAdornment, IconButton, Typography, Slide} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';


const SearchBar = ({ onSearch, searchQuery, resetToHome }) => {
    const [input, setInput] = useState("");

    const handleSearch = () => {
        const query = input.trim();
        if (query !== "") {
            onSearch(query);
            setInput("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    useEffect(() => {
        if (!searchQuery) setInput("");
    }, [searchQuery]);

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Slide direction="left" in={Boolean(searchQuery)} mountOnEnter unmountOnExit>
                <Box
                    onClick={resetToHome}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                >
                    <IconButton size="small">
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="caption" sx={{ mt: -1 }}>
                        Volver
                    </Typography>
                </Box>
            </Slide>

            <TextField
                variant="outlined"
                placeholder="Buscar..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{
                    width: "400px",
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 1,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                    },
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default SearchBar;
