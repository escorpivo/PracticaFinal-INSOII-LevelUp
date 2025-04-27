import React, { useState } from 'react';
import "./UI-Card-style.css";

export const Card = ({ nombre, descripcion, imagen }) => {
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
          <div className='description'>
            <p>{descripcion}</p>
          </div>
        </>
      ) : (
        <div className="card-back-content">
          <h5>{nombre}</h5>
          <p>Descripción breve del juego...</p>
          <p>Más info aquí</p>
        </div>
      )}
    </div>
  );
};

export default Card;
