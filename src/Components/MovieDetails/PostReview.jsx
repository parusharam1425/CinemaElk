import React, { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Modal, Button, Form } from "react-bootstrap";

export default function PostReview({ movie, Close }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [userEmail, setUserEmail] = useState(""); // You can get this from authentication context if available

  // Function to handle posting review to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review || !rating || !userEmail) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      // Add review with movie details to Firestore
      await addDoc(collection(db, "User-Reviews"), {
        userEmail,
        review,
        rating,
        movie_id: movie.id, // Store the movie ID
        movie_name: movie.title, // Store the movie title
        image: movie.poster_path, // Store the movie poster path
        createdAt: new Date(),
      });

      alert("Review posted successfully!");
      Close();
    } catch (error) {
      console.error("Error posting review:", error);
      alert("Failed to post review. Please try again.");
    }
  };

  return (
    <Modal show onHide={Close}>
      <Modal.Header closeButton>
        <Modal.Title>Post Review for {movie.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicReview" className="mt-3">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicRating" className="mt-3">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="10"
              placeholder="Rate the movie (1-10)"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Submit Review
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
