import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import {  ScaleLoader } from 'react-spinners'; // Import the Oval spinner
import './Home.css';

const image_api = 'https://image.tmdb.org/t/p/w500/';
const placeholderImage = 'url_to_placeholder_image'; // Replace with your actual placeholder image URL

const MovieSlider = ({ title, movies }) => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 8,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="movie-category">
      <h6>{title}</h6>
      <div className="movies-slider-container">
        <Slider {...settings} className="slider">
          {movies.map((movie, index) => (
            <Card
              key={index}
              onClick={() => navigate(`/movie/${movie.id}`, { state: movie })}
              className="card"
            >
              <Card.Img
                src={movie.poster_path ? image_api + movie.poster_path : placeholderImage}
                className="card-img"
                alt={movie.title}
              />
              <Card.Title className="card-title">{movie.title}</Card.Title>
            </Card>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async (url, setState) => {
    try {
      const response = await axios.get(url);
      setState(response.data.results);
    } catch (error) {
      setError('Failed to load data. Please try again later.');
      console.error(error);
    }
  };

  useEffect(() => {
    const apiKey = '58ad96e97ac2915a7e028592171533fb';
    const fetchAllMovies = async () => {
      setLoading(true);
      await Promise.all([
        fetchMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`, setNowPlaying),
        fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`, setPopularMovies),
        fetchMovies(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`, setTopRated),
        fetchMovies(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`, setUpcomingMovies),
      ]);
      setLoading(false);
    };
    fetchAllMovies();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <ScaleLoader 
        color='orange'/>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-container">
      <MovieSlider title="Now Playing" movies={nowPlaying} />
      <MovieSlider title="Popular Movies" movies={popularMovies} />
      <MovieSlider title="Top Rated" movies={topRated} />
      <MovieSlider title="Upcoming Movies" movies={upcomingMovies} />
    </div>
  );
}
