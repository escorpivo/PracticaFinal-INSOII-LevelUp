import React, { useState } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim() !== "") {
            onSearch(query);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            padding={2}
        >
            <TextField
                variant="outlined"
                placeholder="Buscar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
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
