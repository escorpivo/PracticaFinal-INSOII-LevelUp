import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameDetail from './GameDetail';

const GameDetailWrapper = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);

    // Seleccionamos automáticamente el backend correcto, para poder usar en producción y en render.
    const baseUrl =
        window.location.hostname === 'localhost'
            ? 'http://127.0.0.1:8080'
            : 'https://practicafinal-insoii-levelup.onrender.com';

    useEffect(() => {
        fetch(`${baseUrl}/games`)
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((g) => g.id === parseInt(id));
                setGame(found);
            })
            .catch((err) => console.error('Error cargando juego:', err));
    }, [id, baseUrl]);

    return <GameDetail game={game} />;
};

export default GameDetailWrapper;
