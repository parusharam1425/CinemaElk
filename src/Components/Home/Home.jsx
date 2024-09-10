import React, { useEffect, useState } from 'react';

import { Card } from 'react-bootstrap';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const image_api = 'https://image.tmdb.org/t/p/w500/';

export default function Home() {
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

  const [nowPlaying, setNowPlaying] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const movie_api = 'https://api.themoviedb.org/3/movie/now_playing?api_key=58ad96e97ac2915a7e028592171533fb';
    axios.get(movie_api).then((response) => {
      const movies = response.data.results;
      setNowPlaying(movies);
      console.log(movie_api)
    });
  }, []);

  useEffect(() => {
    const popularMovies_api = 'https://api.themoviedb.org/3/movie/popular?api_key=58ad96e97ac2915a7e028592171533fb';
    axios.get(popularMovies_api).then((response) => {
      const movies = response.data.results;
      setPopularMovies(movies);
    });
  }, []);

  useEffect(() => {
    const topRatedMovies_api = 'https://api.themoviedb.org/3/movie/top_rated?api_key=58ad96e97ac2915a7e028592171533fb';
    axios.get(topRatedMovies_api).then((response) => {
      const movies = response.data.results;
      setTopRated(movies);
    });
  }, []);

  useEffect(() => {
    const upcomingMovies_api = 'https://api.themoviedb.org/3/movie/upcoming?api_key=58ad96e97ac2915a7e028592171533fb';
    axios.get(upcomingMovies_api).then((response) => {
      const movies = response.data.results;
      setUpcomingMovies(movies);
    });
  }, []);

  return (
    <div className="home-container">    
        
          <div className="now-playing">
            <h6>Now Playing</h6>
            <div className="movies-slider-container">
              <Slider {...settings} className='slider'>
                {nowPlaying.map((movie, index) => (
                  <Card
                    key={index}
                    onClick={() => navigate(`/movie/${movie.id}`, { state: movie })}
                    className="card"
                  >
                    <Card.Img src={image_api + movie.poster_path} className="card-img" />
                    <Card.Title className="card-title">{movie.title}</Card.Title>
                  </Card>
                ))}
              </Slider>
            </div>
          </div>
          <div className="popular-movies">
            <h6>Popular Movies</h6>
            <div className="movies-slider-container">
              <Slider {...settings} className='slider'>
                {popularMovies.map((movie, index) => (
                  <Card
                    key={index}
                    onClick={() => navigate(`/movie/${movie.id}`, { state: movie })}
                    className="card"
                  >
                    <Card.Img src={image_api + movie.poster_path} className="card-img" />
                    <Card.Title className="card-title">{movie.title}</Card.Title>
                  </Card>
                ))}
              </Slider>
            </div>
          </div>
          <div className="top-rated">
            <h6>Top Rated</h6>
            <div className="movies-slider-container">
              <Slider {...settings} className='slider'>
                {topRated.map((movie, index) => (
                  <Card
                    key={index}
                    onClick={() => navigate(`/movie/${movie.id}`, { state: movie })}
                    className="card"
                  >
                    <Card.Img src={image_api + movie.poster_path} className="card-img" />
                    <Card.Title className="card-title">{movie.title}</Card.Title>
                  </Card>
                ))}
              </Slider>
            </div>
          </div>
          <div className="upcoming-movies">
            <h6>Upcoming Movies</h6>
            <div className="movies-slider-container">
              <Slider {...settings} className='slider'>
                {upcomingMovies.map((movie, index) => (
                  <Card
                    key={index}
                    onClick={() => navigate(`/movie/${movie.id}`, { state: movie })}
                    className="card"
                  >
                    <Card.Img src={image_api + movie.poster_path} className="card-img" />
                    <Card.Title className="card-title">{movie.title}</Card.Title>
                  </Card>
                ))}
              </Slider>
            </div>
          </div>
        
      </div>
 
  );
}
