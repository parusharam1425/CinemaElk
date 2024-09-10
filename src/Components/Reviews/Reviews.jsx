import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Reviews.css';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [apiReviews, setApiReviews] = useState([]);
  const [showApiReviews, setShowApiReviews] = useState(true);
  const navigate = useNavigate();

  // Fetch reviews from Firestore
  useEffect(() => {
    async function fetchReviews() {
      try {
        const collectionRef = collection(db, "User-Reviews");
        const querySnapshot = await getDocs(collectionRef);
        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(reviewsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    }
    fetchReviews();
  }, []);

  // Function to handle the click on a review
  const handleReviewClick = async (review) => {
    setSelectedReviewId(review.id);
    setShowApiReviews(true); 
    fetchApiReviews(review.movie_id); 
  };

  // Function to fetch reviews from TMDb API
  const fetchApiReviews = async (movieId) => {
    try {
      const API_REVIEWS_URL = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=cb390091f1e2835553da41fa333cf620`;
      const response = await axios.get(API_REVIEWS_URL);
      setApiReviews(response.data.results);
      console.log("TMDb reviews:", response.data.results);
    } catch (error) {
      console.error("Error fetching TMDb reviews:", error);
    }
  };

  return (
    <Container>
      <h2 className="text-center my-4" style={{ fontFamily: "Tilt Warp" }}>
        Reviews By Cinema Elk Users
      </h2>
      <Row>
        {reviews.map((review) => (
          <Col md={6} lg={6} key={review.id} className="mb-3">
            <Card className="card-container shadow">
              <Row className="g-0">
                <Col xl={8} md={7} xs={9}>
                  <Card.Body>
                    <Card.Title>
                      {review.userEmail ? review.userEmail.split("@")[0] : "Anonymous"}
                    </Card.Title>
                    <hr className="border"/>
                    <Card.Subtitle className="mb-2 text-muted">
                      {review.movie_name || "Unknown Movie"}
                    </Card.Subtitle>
                    <Rating name="read-only" value={review.rating || 0} readOnly />
                    <Card.Text className="mt-2">
                      {review.id === selectedReviewId
                        ? review.review || "No review available."
                        : `${(review.review || "").slice(0, 50)}...`}
                    </Card.Text>

                    {review.id === selectedReviewId ? (
                      <Button variant="primary" onClick={() => setSelectedReviewId(null)}>
                        Read less
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={() => handleReviewClick(review)}>
                        Read more
                      </Button>
                    )}
                  </Card.Body>
                </Col>
                <Col xl={3} md={4} xs={3} className="image-container">
                  <Card.Img
                    onClick={()=> navigate(`/movie/${review.movie_id}`, {
                      state: {
                        movieId: review.movie_id,
                        title: review.movie_name,
                      },
                    })}
                    className="image-card"
                    src={`https://image.tmdb.org/t/p/w500${review.image || ""}`}
                    alt={review.movie_name || "Movie"}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Display TMDb Reviews */}
      {showApiReviews && (
        <div className="mt-4">
          <h4 className="text-center">Reviews from TMDb</h4>
          {apiReviews.length === 0 ? (
            <p className="text-center">No reviews available from TMDb.</p>
          ) : (
            apiReviews.map((review) => (
              <Card key={review.id} className="mb-3 shadow">
                <Card.Body>
                  <Card.Title>{review.author || "Anonymous"}</Card.Title>
                  <Card.Text>
                    {review.content.split(" ").slice(0, 30).join(" ")}
                    {review.content.split(" ").length > 30 && "..."}
                  </Card.Text>
                  <Rating
                    name="read-only"
                    value={review.author_details.rating || 0}
                    readOnly
                  />
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      )}
    </Container>
  );
}
