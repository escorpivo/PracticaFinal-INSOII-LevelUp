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
          <h5>{nombre}</h5>
          <div className='description'>
            <p>{descripcion}</p>
          </div>

          
          <p
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/game/${id}`;
            }}
            style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
          >
            Más info aquí
          </p>



        </div>
      )}
    </div>
  );
};

export default Card;
