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
    e.stopPropagation(); // Evita que se voltee al hacer clic en el corazón
    addToFavorites(id);
  };

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

          <div className='favorite'>
            <IconButton onClick={handleFavoriteClick}>
              <FavoriteBorderIcon />
            </IconButton>
          </div>

          <div className="rating">
            <StarRating initialRating={Math.round(rating / 20)} size="5rem" />
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
