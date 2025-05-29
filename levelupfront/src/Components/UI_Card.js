// File: UI_Card.js
import React, { useState } from 'react';
import "./UI-Card-style.css";
import StarRating from "./StarRating";
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export const Card = ({ id, nombre, descripcion, imagen, rating, addToFavorites }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    addToFavorites(id);
  };

  // Convertir rating (0-100) a escala 0-5 con medio puntos
  const starValue = Math.round((rating / 20) * 2) / 2;

  return (
    <div className={`card ${flipped ? "flipped" : ""}`} style={{ width: '18rem' }} onClick={handleFlip}>
      {!flipped ? (
        <>
          <div className='overflow'>
            <img src={imagen} alt={nombre} className='card-img' />
          </div>

          <div className='title'>
            <h5>{nombre}</h5>
          </div>

          {/* Contenedor centrado para corazón y estrellas */}
          <div
            className="card-meta"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '0.5rem 0'
            }}
          >
            <IconButton onClick={handleFavoriteClick}>
              <FavoriteBorderIcon />
            </IconButton>
            <StarRating
              initialRating={starValue}
              readOnly={true}
              size="1.5rem"
            />
          </div>
        </>
      ) : (
        <div className="card-back-content">
          <div className="card-back-inner">
            <h5>{nombre}</h5>

            <div className="description">
              <p>{descripcion}</p>
            </div>

            <button
              className="card-info-button"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/game/${id}`;
              }}
            >
              Más info aquí
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
