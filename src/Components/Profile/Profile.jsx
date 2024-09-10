import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Ensure this is correctly configured
import { getAuth } from "firebase/auth";
import { Card, Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
import { StarFill, PencilSquare, Trash } from "react-bootstrap-icons";

export default function Profile() {
  const auth = getAuth();
  const [reviews, setReviews] = useState([]);
  const [show, setShow] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  // Function to fetch all reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const collectionRef = collection(db, "User-Reviews");
        const querySnapshot = await getDocs(collectionRef);
        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Reviews: ", reviewsData); // Debug log
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    }
    fetchReviews();
  }, []);

  // Function to fetch reviews of the current logged-in user
  async function handleCurrentUsersData() {
    try {
      const collectionRef = collection(db, "User-Reviews");
      const q = query(
        collectionRef,
        where("userEmail", "==", auth.currentUser.email)
      );
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched User's Reviews: ", reviewsData); // Debug log
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching current user's reviews: ", error);
    }
  }

  // Fetch current user's data on component mount
  useEffect(() => {
    if (auth.currentUser) {
      handleCurrentUsersData();
    }
  }, [auth.currentUser]);

  // Handle deleting a review
  async function handleDeleteReview(id) {
    try {
      await deleteDoc(doc(db, "User-Reviews", id));
      setReviews((prevReviews) => prevReviews.filter((r) => r.id !== id));
      console.log(`Review with ID: ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting review: ", error);
    }
  }

  // Handle updating a review
  async function updateReviewData(id) {
    try {
      const collectionRef = collection(db, "User-Reviews");
      const docRef = doc(collectionRef, id);
      await updateDoc(docRef, {
        review: review,
        rating: rating,
      });
      console.log("Document updated successfully");
      setShow(false);
      setReview(""); // Clear the input fields
      setRating(1);
      handleCurrentUsersData(); // Refresh reviews after update
    } catch (err) {
      console.error("Error updating review: ", err);
    }
  }

  return (
    <Container>
      <h2
        style={{
          fontFamily: "Tilt Warp",
          textAlign: "center",
          marginTop: "6rem",
        }}
      >
        Reviews By {auth.currentUser ? auth.currentUser.email.split("@")[0] : "User"}
      </h2>
      <Row className="allReviewsScreen">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="mb-4" style={{ maxWidth: "800px" }}>
              <Row className="gx-0">
                <Col md={6}>
                  <Card.Img
                    variant="top"
                    src={`https://image.tmdb.org/t/p/w500${review.image || ''}`} 
                    alt={review.movie_name}
                  />
                </Col>
                <Col md={6}>
                  <Card.Body>
                    <Card.Title>{review.userEmail.split("@")[0]}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                    {review.movie_name || "Unknown Movie"}
                    </Card.Subtitle>
                    <div className="d-flex align-items-center">
                      {[...Array(5)].map((_, index) => (
                        <StarFill
                          key={index}
                          className={
                            index < review.rating ? "text-warning" : "text-muted"
                          }
                        />
                      ))}
                    </div>
                    <Card.Text>
                      {review.id === selectedReviewId
                        ? review.review
                        : review.review.slice(0, 100) + "..."}
                    </Card.Text>
                    {review.id === selectedReviewId ? (
                      <Button
                        variant="primary"
                        onClick={() => setSelectedReviewId(null)}
                      >
                        Read less
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => setSelectedReviewId(review.id)}
                      >
                        Read more
                      </Button>
                    )}
                    <PencilSquare
                      className="ml-3"
                      onClick={() => {
                        setShow(true);
                        setReview(review.review);
                        setRating(review.rating);
                        setSelectedReviewId(review.id);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                    <Trash
                      className="ml-3"
                      onClick={() => handleDeleteReview(review.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))
        ) : (
          <p>No reviews found.</p> // Display message if no reviews are found
        )}
      </Row>

      {/* Modal for editing review */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reviewTextarea">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="ratingSelect">
              <Form.Label>Rate Us</Form.Label>
              <Form.Control
                as="select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value > 1 ? "s" : ""}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => updateReviewData(selectedReviewId)}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
