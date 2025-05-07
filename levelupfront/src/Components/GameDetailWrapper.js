import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameDetail from './GameDetail';
import axios from 'axios';

const GameDetailWrapper = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8080/games")
      .then((response) => {
        const found = response.data.find(g => g.id === parseInt(id));
        setGame(found);
      })
      .catch((err) => console.error("Error cargando juego:", err));
  }, [id]);

  return <GameDetail game={game} />;
};

export default GameDetailWrapper;
