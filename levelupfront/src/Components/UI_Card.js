import React from 'react';
import "./UI-Card-style.css";

export const Card = ({nombre, descripcion, imagen}) => {
  return (
    <div className="card text-centered" style={{ width: '18rem' }}>
        <div className='overflow'>
          <img src={imagen} alt={nombre} className='card-img'/>
        </div>
        <div className='title'>
          <h5>{nombre}</h5>
        </div>
        <div className='description'>
          <p>{descripcion}</p>
        </div>
        
    </div>
  );
};
export default Card;