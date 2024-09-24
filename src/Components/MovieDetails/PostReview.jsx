import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import './PostReview.css'

export default function PostReview({ movie, Close }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Fetch the logged-in user's email
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);


  // Function to handle posting review to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review || !rating) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      // Add review with movie details to Firestore
      await addDoc(collection(db, "User-Reviews"), {
        userEmail,
        review,
        rating: parseFloat(rating),
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

  const handleRatingChange = (e) => {
    const value = e.target.value;
    // Allow only numbers between 1 and 5 with up to 2 decimal places
    if (value === "" || /^([1-5])(\.\d{1,2})?$/.test(value)) {
      setRating(value);
    } else {
      alert("Please enter a valid rating between 1 and 5.");
    }
  };

  return (
    <Modal show onHide={Close}>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicReview" className="mt-3">
            <Form.Control
              as="textarea"
              className="form-review"
              rows={3}
              placeholder="Enter your review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicRating" className="mt-3">
            <InputGroup className="mt-3">
              <Form.Label className="me-2">Rating</Form.Label>
              <Form.Control
                type="text"
                value={rating}
                onChange={handleRatingChange}
                className="input-rating"
                // placeholder="1 to 5"
              />
              <span className="ms-2">Out of 5</span>
            </InputGroup>
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Submit Review
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
