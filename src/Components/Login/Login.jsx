import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Row, Col } from 'react-bootstrap';
import Logo from '../../assets/login.jpg';
import Cinema from '../../assets/cinemaElk.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const googleProvider = new GoogleAuthProvider();

  const handleJoinClub = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        console.log(userCred.user);
        setLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        setError('Login failed. Please check your credentials.');
        console.error('Error logging in:', error);
      });
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log(result.user);
        setLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        setError('Google sign-in failed. Please try again.');
        console.error('Error with Google login:', error);
      });
  };

  return (
    <div className='main-container'>
      <Row>
        <Col xl={6} xs={12}>
          <div className='login-image'>
            <img src={Logo} alt="Login" />
          </div>
        </Col>
        <Col xl={6} xs={12} className='form-card'>
          <div className="cinema-image">
            <img src={Cinema} alt="Cinema" className="cinema-image" />
          </div>
          <div className='form-inputs'>
            <Input
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
              style={{ height: 40 }}
              placeholder="Enter your email"
            />
            <Input
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
              type="password"
              className='enter-pass-input'
              style={{height: 40 }}
              placeholder="Enter your password"
            />
          </div>
          {error && <div style={{ color: 'white', textAlign: 'center' }}>{error}</div>}
          <Button
            className='google-login-button'
            onClick={handleLogin}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            className='google-login-button'
            onClick={handleGoogleLogin}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login with Google'}
          </Button>
          <p className='navgate-link mt-1'>
            Join the club? {' '}
            <span onClick={handleJoinClub} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Click here
            </span>
          </p>
        </Col>
      </Row>
    </div>
  );
}
