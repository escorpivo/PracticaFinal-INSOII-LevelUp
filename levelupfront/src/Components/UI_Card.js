import React, { useState } from 'react';
import "./UI-Card-style.css";
import StarRating from "./StarRating";

export const Card = ({ id, nombre, descripcion, imagen, rating }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
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
