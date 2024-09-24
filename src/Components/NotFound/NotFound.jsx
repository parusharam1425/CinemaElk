import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './NotFound.css'; 
import NotFoundImage from '../../assets/notFound.jpg'; // Path to the image
import { Col, Row } from 'react-bootstrap';

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <Row>
          <Col xl={6}>
          <img src={NotFoundImage} alt="404 Not Found" className="not-found-image" />
          </Col>
          <Col xl={6}>
          <h1 className="not-found-title">Oops! Looks like you've lost your way.</h1>
        <p className="not-found-text">
          The page you're looking for doesn't exist. You can return to the homepage by clicking below.
        </p>
        <Button type="primary" onClick={handleGoHome} className="not-found-button">
          Go Home
        </Button>
          </Col>
        </Row>
       
       
      </div>
    </div>
  );
}
