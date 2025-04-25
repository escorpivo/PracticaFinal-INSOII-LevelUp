import React, { useEffect, useState } from "react";
import axios from "axios";
import Card  from "./UI_Card";

const CardsHolder = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        // Hacer una solicitud GET al backend en http://127.0.0.1:5000/games
        axios.get("http://127.0.0.1:8080/games")
            .then((response) => {
                setGames(response.data); // Guardar los juegos en el estado
                console.log("Datos recibidos:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching games:", error);
            });
    }, []);

    return (
        <div>
            <h1>Lista de Juegos</h1>
            <div>
                {games.map((game, index) => (

                    <Card
                        nombre={game.name}
                        descripcion={game.storyline ?? "No disponible"}
                        imagen={game.coverUrl}
                    />

                ))}

            </div>
        </div>
    );
}

export default CardsHolder;