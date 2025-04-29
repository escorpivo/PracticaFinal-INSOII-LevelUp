import React, { useState } from "react";

export const StarRating = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null);

  const handleClick = (index, event) => {
    event.stopPropagation(); 
    setRating(index);
    if (onRate) onRate(index);
  };
  

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          style={{
            fontSize: "3rem",
            cursor: "pointer",
            color: (hover || rating) >= index ? "#ffc107" : "#ccc",
            transition: "color 0.2s"
          }}
          onClick={(e) => handleClick(index, e)}
          onMouseEnter={() => setHover(index)}
          onMouseLeave={() => setHover(null)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
