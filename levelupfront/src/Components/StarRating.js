import React, { useState, useEffect } from "react";

const StarRating = ({
  initialRating = 0,
  readOnly = false,
  size = "2rem"
}) => {
  const [rating, setRating] = useState(initialRating);

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
  };

  // Render static stars when readOnly to avoid hover/color changes
  const Star = ({ index }) => {
    const isFull = rating >= index;
    const isHalf = rating + 0.5 === index;
    const char = isHalf ? "⯪" : "★";
    const color = isFull || isHalf ? "#ffc107" : "#ccc";
    return (
      <span
        key={index}
        style={{ fontSize: size, color, userSelect: "none" }}
        onClick={readOnly ? undefined : (e) => handleClick(index, e)}
      >
        {char}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", pointerEvents: readOnly ? "none" : "auto" }}>
      {[1, 2, 3, 4, 5].map((i) => <Star index={i} key={i} />)}
    </div>
  );
};

export default StarRating;