import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import GameDetail from './GameDetail';

const baseUrl =
    window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:8080'
        : 'https://practicafinal-insoii-levelup.onrender.com';


const GameDetailWrapper = ({ games }) => {
    const { id } = useParams();
    const [game, setGame] = useState(null);

    useEffect(() => {
        const gameId = parseInt(id);

        //Verificamos que games esté definido y sea un array
        if (games && Array.isArray(games)) {
            const found = games.find(g => g.id === gameId);
            if (found) {
                setGame(found);
                return;
            }
        }

        //Si no está en local o games aún no está cargado, pedimos al backend
        fetch(`${baseUrl}/api/games/${id}`)

            .then(res => {
                if (!res.ok) throw new Error('Error al obtener el juego');
                return res.json();
            })
            .then(data => setGame(data))
            .catch(err => console.error('Error cargando juego:', err));

    }, [id, games]);

    return <GameDetail game={game} />;
};

export default GameDetailWrapper;