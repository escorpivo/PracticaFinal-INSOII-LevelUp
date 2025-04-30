import React, { useState } from "react";

export const StarRating = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null);
  const [lastClicked, setLastClicked] = useState(null);

  const handleClick = (index, event) => {
    event.stopPropagation(); 
    setRating(index);
    
    if (rating === index) {
      setRating(index - 0.5); // media estrella
    } else if (rating === index - 0.5) {
      setRating(index - 1); // desactiva solo esa estrella
    } else {
      setRating(index); // estrella completa
    }
  
    if (onRate) onRate(rating);
  };
  

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFull = rating >= index;
        const isHalf = rating + 0.5 === index;

        return (
          <span
            key={index}
            style={{
              fontSize: "2rem",
              cursor: "pointer",
              color: isFull || isHalf ? "#ffc107" : "#ccc",
            }}
            onClick={(e) => handleClick(index, e)}
          >
            {isHalf ? "⯪" : "★"}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
