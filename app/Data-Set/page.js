"use client";

import { Box, Typography } from "@mui/material";
import { React, useState, useEffect } from "react";

const DataSet = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/reviews.json")
      .then((response) => response.json())
      .then((data) => setReviews(data.reviews));
  }, []);

  return (
    <Box>
      <Typography variant="h4" textAlign="center">
        Professors
      </Typography>

      <Box >
        {reviews.map((review, index) => (
          <Box display="flex"  flexDirection={'column'} key={index} border={'2px solid black'} gap={2} marginY={2} padding={2}>
            <h2>Name: {review.professor}</h2>
            <p>Review: {review.review}</p>
            <p>Subject: {review.subject}</p>
            <p>Stars: {review.stars}</p>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DataSet;
