import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostReview from './PostReview';
import { db } from '../../firebase';
import { collection, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';

import './MovieDetails.css';

const image_api = 'https://image.tmdb.org/t/p/w500/';

export default function MovieDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { title, poster_path, overview, id, movieId } = location.state || {};
    const [movieid, setMovieid] = useState(id); // Initialize movieid state with the id from location
    const [similarmovies, setSimilarmovies] = useState([]);
    const [modal, setModal] = useState(false);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [notes, setNotes] = useState([]);
    const [apiReviews, setApiReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showApiReviews, setShowApiReviews] = useState(true);


    const fetchCastAndCrew = async (movieId) => {
        const CASTANDCREW_API = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=10b31efc55017d339c319848bdaac1da`;
        try {
            const response = await axios.get(CASTANDCREW_API);
            setCast(response.data.cast);
            setCrew(response.data.crew);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCastAndCrew(movieid); // Fetch cast and crew whenever movieid changes
    }, [movieid]);

    useEffect(() => {
        const Movies_api = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=10b31efc55017d339c319848bdaac1da`;
        axios.get(Movies_api)
            .then((response) => {
                setSimilarmovies(response.data.results);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [movieid]);

    useEffect(() => {
        fetchAllNotes(); // Fetch reviews from Firestore
        fetchApiReviews(); // Fetch reviews from TMDb API
    }, []);

    const handleReviewClick = async (review) => {
        setSelectedReview(review);
        fetchApiReviews();
        setShowApiReviews(true);
    };

    const fetchApiReviews = async () => {
        try {
            const API_REVIEWS_URL = `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=10b31efc55017d339c319848bdaac1da`;
            const response = await axios.get(API_REVIEWS_URL);
            setApiReviews(response.data.results);
            console.log("Fetched API Reviews:", response.data.results); // Debugging: Check fetched API reviews
        } catch (error) {
            console.log("Error fetching API reviews:", error); // Log any errors
        }
    };
    const fetchAllNotes = async () => {
        try {
            const qry = query(collection(db, "User-Reviews")); // Ensure the collection name matches exactly

            onSnapshot(qry, (querySnapshot) => {
                const fetchedNotes = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));

                console.log("Fetched Reviews:", fetchedNotes); // Debugging: Check fetched data
                setNotes(fetchedNotes);
            });
        } catch (error) {
            console.log("Error fetching notes:", error); // Debugging: Log any errors
        }
    };
    const handleSimilarMovieClick = (movie) => {
        setMovieid(movie.id); // Update movieid state when a similar movie is clicked
        navigate(`/movie/${movie.id}`, { state: movie });
    };

    const deleteReview = async (reviewId) => {
        try {
            const reviewDoc = doc(db, 'User-Reviews', reviewId);
            await deleteDoc(reviewDoc);
            console.log(`Review with ID: ${reviewId} deleted successfully`);
            setnotes((prevNotes) => prevNotes.filter((note) => note.id !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };
    return (
        <div className='movie-details-container'>
            <Row style={{ display: 'flex' }}>
                <Col xl={8} style={{ padding: 20 }} className='mt-4'>
                    <div >
                        <img style={{ height: '25rem', borderRadius: '10px' }} src={image_api + poster_path} alt=""
                            onClick={() => navigate(`/reviews/${id}`)}
                        />
                        <h6 style={{ marginTop: '2rem' }}>{title}</h6>
                        <div style={{ marginTop: '2rem' }}>
                            <h6>Movie Overview:</h6>
                            <span>{overview}</span>
                        </div>
                        <Button onClick={() => setModal(true)} style={{ marginTop: '2rem' }}>Post Review</Button>
                        {modal && <PostReview movie={{ id, title, poster_path }} Close={() => setModal(false)} />}
                        <div>
                            <h2>Cast & Crew</h2>
                            <div className="scrollable" style={{ display: "flex", width: "100%", overflow: "auto" }}>
                                {cast.map((member) => (
                                    <div style={{ marginRight: "1rem" }} key={`cast-${member.id}`}>
                                        <img style={{ height: "100px", borderRadius: "50%" }} src={`https://image.tmdb.org/t/p/w500${member.profile_path}`} alt={member.name} />
                                        <br />
                                        <span style={{ fontSize: 11 }}>{member.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="scrollable" style={{ display: "flex", overflow: "auto", marginTop: 20 }}>
                                {crew.map((member) => (
                                    <div style={{ marginRight: "1.5rem" }} key={`crew-${member.id}-${member.job}`}>
                                        <img style={{ height: "100px", borderRadius: "50%" }} src={`https://image.tmdb.org/t/p/w500${member.profile_path}`} alt={member.name} />
                                        <br />
                                        <span style={{ fontSize: 11 }}>{member.name.split(' ').slice(0, 1).join(' ') + (member.name.split(' ').length > 1 ? '...' : '')} ({member.job.split(' ').slice(0, 1).join(' ') + (member.job.split(' ').length > 1 ? '...' : '')})</span>
                                        
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h6 style={{ marginTop: '3rem' }}>Similar movies:</h6>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {similarmovies.map((movie) => (
                                    <div style={{ marginLeft: '2rem' }} key={`similar-${movie.id}`}>
                                        <Card onClick={() => handleSimilarMovieClick(movie)} style={{ border: 'none', outline: 'none', marginTop: '3rem', backgroundColor: '#32a88c' }}>
                                            <Card.Img style={{ height: '8rem' }} src={image_api + movie.poster_path} alt='image not available'></Card.Img>
                                            <Card.Title style={{ color: 'white', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 'bold' }}>{movie.title}</Card.Title>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
                <hr className='vertical-line' />
                <Col xl={4} className='mt-5'>
                    <h6>Reviews by Elk Users:</h6>
                    <div>
                        {notes.length === 0 ? (
                            <p>No user reviews available.</p>
                        ) : (
                            notes.map((note) => {
                                const comment = note.data.review || 'No Comment Available';
                                const name = note.data.userEmail ? note.data.userEmail.split("@")[0] : "Anonymous";
                                const rate = note.data.rating !== undefined ? `${note.data.rating} Stars` : 'No Rating';

                                return (
                                    <div
                                        key={`review-${note.id}`}
                                        style={{ marginTop: 20, border: '1px solid gray', borderRadius: '10px', position: 'relative' }}
                                        onClick={() => handleReviewClick(note)} // Click handler to fetch TMDb reviews
                                    >
                                        <p className='review'>{comment}</p>
                                        <div className='reviews-card'>
                                            <span className='review-name'>{name}</span>
                                            <span style={{ color: 'blue' }}>{rate}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering review click
                                                deleteReview(note.id);
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                backgroundColor: 'red',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                padding: '5px 10px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                );
                            })
                        )}

                        {/* Show TMDb API Reviews when a Firestore review is clicked */}
                        {showApiReviews && (
                            <div>
                                <h6 className="mt-4">Reviews from TMDb:</h6>
                                {apiReviews.length === 0 ? (
                                    <p>No reviews available from TMDb.</p>
                                ) : (
                                    apiReviews.map((review) => {
                                        // Truncate the review content to 30 words
                                        const truncatedContent = review.content
                                            ? review.content.split(' ').slice(0, 8).join(' ') + (review.content.split(' ').length > 10 ? '...' : '')
                                            : 'No Comment Available';

                                        return (
                                            <div
                                                key={`api-review-${review.id}`}
                                                style={{ marginTop: 20, border: '1px solid gray', borderRadius: '10px' }}
                                            >
                                                <p className='review'>{truncatedContent}</p>
                                                <div className='reviews-card'>
                                                    <div>
                                                        <img src={`https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}`} alt={review.author} className='review-avatar' />
                                                        <span className='review-name'>{review.author || 'Anonymous'}</span>
                                                    </div>
                                                    <span style={{ color: 'blue' }}>
                                                        {review.author_details.rating ? `${review.author_details.rating} Stars` : 'No Rating'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
}
