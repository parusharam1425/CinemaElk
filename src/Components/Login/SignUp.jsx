import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Row, Col } from 'react-bootstrap';
import Logo from '../../assets/login.jpg';
import Cinema from '../../assets/cinemaElk.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword,GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './Login.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const googleProvider = new GoogleAuthProvider();


  const handleSignUp = () => {
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        console.log('User Signed up', userCred.user);
        setLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        setError('Signup failed. Please try again.');
        console.error('Error signing up:', error);
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
        <Col xs={12} md={8} xl={6}>
        <div className="login-image">

          <img src={Logo} alt="Login" />
        </div>
        </Col>
        <Col xl={6} className='form-card'>
          <div>
            <img src={Cinema} alt="Cinema" className="cinema-image" />
          </div>
          <div className='form-inputs'>
            <Input
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
              style={{ width: 250, height: 40, margin: 10 }}
              placeholder="Enter your email"
            />
            <Input
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
              type="password"
              style={{ width: 250, height: 40, margin: 10 }}
              placeholder="Enter your password"
            />
          </div>
          <div className='form-input-password'>
            <Input
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              value={confirmPassword}
              type="password"
              style={{ width: 520, height: 40, margin: 10 }}
              placeholder="Confirm your password"
            />
          </div>
          {error && <div style={{ color: 'white', textAlign: 'center' }}>{error}</div>}
          <Button
          className='login-button'
            onClick={handleSignUp}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Joining in...' : 'Join the club'}
          </Button>
          <Button
            className='google-login-button'
            onClick={handleGoogleLogin}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login with Google'}
          </Button>
          <p className='navgate-link'>
            Already a member? {' '}
            <span onClick={() => navigate('/login')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Click here
            </span>
          </p>
        </Col>
      </Row>
    </div>
  );
}
