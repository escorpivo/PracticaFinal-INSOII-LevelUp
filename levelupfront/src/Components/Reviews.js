import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Rating } from '@mui/material';
import './Reviews.css';

const baseUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://practicafinal-insoii-levelup.onrender.com';

const Reviews = ({ token }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${baseUrl}/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Error al cargar reseñas");

        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
  }, [token]);

  return (
    <Box className="reviews-container">
      <Typography variant="h4" className="reviews-title">Mis Reseñas</Typography>

      {reviews.map((review, index) => (
        <Card key={`${review.gameId}-${index}`} className="review-card">
          <img src={review.coverUrl || '/fallback.png'} alt={review.name} />
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{review.name}</Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic", color: "#888" }}>
                {review.commentedAt ? new Date(review.commentedAt).toLocaleDateString() : ''}
              </Typography>
            </Box>
            <Rating value={review.rating || 0} precision={0.5} readOnly />
            <Typography className="review-comment">{review.comment}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Reviews;
