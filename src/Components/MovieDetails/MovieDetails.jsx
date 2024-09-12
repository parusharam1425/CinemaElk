import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
// import { Trash } from 'react-bootstrap-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Rating from "@mui/material/Rating";
import axios from 'axios';
import PostReview from './PostReview';
import { db } from '../../firebase';
import { collection, onSnapshot, query, doc, deleteDoc, where} from 'firebase/firestore';

import './MovieDetails.css';
import { ScaleLoader } from 'react-spinners';

const image_api = 'https://image.tmdb.org/t/p/w500/';

export default function MovieDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { title, poster_path, overview, id } = location.state || {};
    const [movieid, setMovieid] = useState(id);
    const [similarmovies, setSimilarmovies] = useState([]);
    const [modal, setModal] = useState(false);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [notes, setNotes] = useState([]);
    const [apiReviews, setApiReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showApiReviews, setShowApiReviews] = useState(true);
    const [loading, setLoading] = useState(true)


    const fetchCastAndCrew = async (id) => {
        const CASTANDCREW_API = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=58ad96e97ac2915a7e028592171533fb`;
        try {
            const response = await axios.get(CASTANDCREW_API);
            setCast(response.data.cast);
            setCrew(response.data.crew);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCastAndCrew(movieid);
    }, [movieid]);

    useEffect(() => {
        setLoading(true)
        const Movies_api = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=58ad96e97ac2915a7e028592171533fb`;
        axios.get(Movies_api)
            .then((response) => {
                setSimilarmovies(response.data.results);
            })
            .catch((err) => {
                console.log(err);
            });
            setLoading(false)
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
            const API_REVIEWS_URL = `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=58ad96e97ac2915a7e028592171533fb`;
            const response = await axios.get(API_REVIEWS_URL);
            setApiReviews(response.data.results);
            console.log("Fetched API Reviews:", response.data.results); // Debugging: Check fetched API reviews
        } catch (error) {
            console.log("Error fetching API reviews:", error); // Log any errors
        }
    };
    const fetchAllNotes = async () => {
        try {
            if (!movieid) return;
            const qry = query(collection(db, "User-Reviews"), where("movie_id", "==", movieid));
            // console.log("Fetching reviews for movieId:", movieid);
            onSnapshot(qry, (querySnapshot) => {
                // Log querySnapshot to see if documents are fetched
                // console.log("Firestore snapshot received:", querySnapshot.docs);
                const fetchedNotes = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                // console.log("Fetched reviews:", fetchedNotes);
                setNotes(fetchedNotes);
            });
        } catch (error) {
            console.log("Error fetching notes:", error);
        }
    };
    
    const handleSimilarMovieClick = (movie) => {
        setMovieid(movie.id);
        fetchApiReviews()
        navigate(`/movie/${movie.id}`, { state: movie });
    };

    // const deleteReview = async (reviewId) => {
    //     try {
    //         const reviewDoc = doc(db, 'User-Reviews', reviewId);
    //         await deleteDoc(reviewDoc);
    //         console.log(`Review with ID: ${reviewId} deleted successfully`);
    //         setnotes((prevNotes) => prevNotes.filter((note) => note.id !== reviewId));
    //     } catch (error) {
    //         console.error('Error deleting review:', error);
    //     }
    // };

    if (loading) {
        return (
          <div className="loading">
            <ScaleLoader 
            color='orange'/>
          </div>
        );
      }

    return (
        <div className='movie-details-container'>
            <Row style={{ display: 'flex' }}>
                <Col xl={7} style={{ padding: 20 }} className='mt-4'>
                    <div className='movie-details-card'>
                        <img className='movie-details-image' style={{ height: '70vh', width: '50%' }} src={image_api + poster_path} alt=""
                            onClick={() => navigate('/reviews')}
                        />
                        <h6 style={{ marginTop: '2rem' }}>{title}</h6>
                        <div className='movie-details-overview' style={{ marginTop: '2rem' }}>
                            <h6>Movie Overview:</h6>
                            <span>{overview}</span>
                        </div>
                        <Button onClick={() => setModal(true)} style={{ marginTop: '0.5rem' }} className='btn btn-warning' >Post Review</Button>
                        {modal && <PostReview movie={{ id, title, poster_path }} Close={() => setModal(false)} />}
                        <div style={{ marginTop: '1rem' }}>
                            <h2 className='cast-heading'>Cast & Crew</h2>
                            <div className="crew-card" style={{ display: "flex", width: "100%", overflow: "auto" }}>
                                {cast.map((member) => (
                                    <div style={{ marginRight: "1rem" }} key={`cast-${member.id}`}>
                                        <img style={{ height: "15vh", borderRadius: "20%" }} src={`https://image.tmdb.org/t/p/w500${member.profile_path}`} alt={member.name} />
                                        <br />
                                        <span style={{ fontSize: 11 }}>{member.name.split(' ').splice(0, 1)}</span>
                                    </div>
                                ))}
                            </div>
                            {/* <div className="scrollable" style={{ display: "flex", overflow: "auto", marginTop: 20 }}>
                                {crew.map((member) => (
                                    <div style={{ marginRight: "1.5rem" }} key={`crew-${member.id}-${member.job}`}>
                                        <img style={{ height: "100px", borderRadius: "50%" }} src={`https://image.tmdb.org/t/p/w500${member.profile_path}`} alt={member.name} />
                                        <br />
                                        <span style={{ fontSize: 11 }}>{member.name.split(' ').slice(0, 1).join(' ') + (member.name.split(' ').length > 1 ? '...' : '')} ({member.job.split(' ').slice(0, 1).join(' ') + (member.job.split(' ').length > 1 ? '...' : '')})</span>
                                        
                                    </div>
                                ))}
                            </div> */}
                        </div>

                        <div>
                            <h6 style={{ marginTop: '1rem' }}>Similar movies:</h6>
                            <div className='simlar-movies-card'>
                                {similarmovies.map((movie) => (
                                    <div className='movies-card' key={`similar-${movie.id}`}>
                                        <Card onClick={() => handleSimilarMovieClick(movie)} style={{ border: 'none', outline: 'none', marginTop: '1rem' }}>
                                            <Card.Img className='movie-card-image' src={image_api + movie.poster_path} alt='image not available'></Card.Img>
                                            <Card.Title className='movie-card-title' style={{ marginTop: '0.3rem' }}>{movie.title.split(' ').slice(0, 2).join(' ') + (movie.title.split(' ').length > 1 ? '...' : '')}</Card.Title>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
                <hr className='vertical-line' />
                <Col xl={5} className='reviews-section mt-5'>
                    <h6>Reviews by Elk Users:</h6>
                    <div>
                        {notes.length === 0 ? (
                            <p>No user reviews available.</p>
                        ) : (
                            notes.map((note) => {
                                const comment = note.data.review || 'No Comment Available';
                                const name = note.data.userEmail ? note.data.userEmail.split("@")[0] : "Anonymous";
                                const rate = note.data.rating !== undefined ? `${note.data.rating}` : 'No Rating';

                                return (
                                    <div
                                        className='reviews-container'
                                        key={`review-${note.id}`}
                                        style={{ marginTop: 20, border: '1px solid gray', borderRadius: '10px', position: 'relative' }}
                                        onClick={() => handleReviewClick(note)} // Click handler to fetch TMDb reviews
                                    >
                                        <p className='review'>{comment}</p>
                                        <div className='reviews-card'>
                                            <span className='review-name'>{name}</span>
                                            <Rating name="read-only" value={rate || 0} readOnly />
                                            {/* <div>
                                                <Trash
                                                    className="delete-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteReview(note.id);
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div> */}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {/* Show TMDb API Reviews when a Firestore review is clicked */}
                        {showApiReviews && (
                            <div className='reviews-section-tmdb'>
                                <h6 className="mt-4">Reviews from TMDb:</h6>
                                {apiReviews.length === 0 ? (
                                    <p>No reviews available from TMDb.</p>
                                ) : (
                                    apiReviews.map((review) => {
                                        const truncatedContent = review.content
                                            ? review.content.split(' ').slice(0, 20).join(' ') + (review.content.split(' ').length > 20 ? '...' : '')
                                            : 'No Comment Available';

                                        return (
                                            <div
                                                className='reviews-container'
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
                                                        <Rating name="read-only" value={review.author_details.rating || 0} readOnly />
                                                        {/* {review.author_details.rating ? `${review.author_details.rating} Stars` : 'No Rating'} */}
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
