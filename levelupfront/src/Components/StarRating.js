import React, { useState, useEffect } from "react";

const StarRating = ({
  initialRating = 0,
  onRate,               // callback que recibe el nuevo rating
  readOnly = false      // desactiva clics y cursor si es true
}) => {
  const [rating, setRating] = useState(initialRating);

  // Sincroniza el estado interno cuando cambie initialRating
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (index, e) => {
    e.stopPropagation();
    if (readOnly) return;

    let newValue;
    if (rating === index) {
      newValue = index - 0.5;
    } else if (rating === index - 0.5) {
      newValue = index - 1 >= 0 ? index - 1 : 0;
    } else {
      newValue = index;
    }

    setRating(newValue);
    onRate?.(newValue);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFull = rating >= index;
        const isHalf = rating + 0.5 === index;

        return (
          <span
            key={index}
            onClick={(e) => handleClick(index, e)}
            style={{
              fontSize: "2rem",
              cursor: readOnly ? "default" : "pointer",
              color: isFull || isHalf ? "#ffc107" : "#ccc",
            }}
          >
            {isHalf ? "⯪" : "★"}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
