import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Row, Col } from 'react-bootstrap';
import Logo from '../../assets/login.jpg';
import Cinema from '../../assets/cinemaElk.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className='main-container'>
      <Row>
        <Col xs={12} md={8} xl={6}>
          <img src={Logo} alt="Login" className="login-image" />
        </Col>
        <Col xl={6} className='form-card'>
          <div>
            <img src={Cinema} alt="Cinema" className="cinema-image" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
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
          <div>
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
            onClick={handleSignUp}
            style={{
              width: 510,
              margin: 20,
              backgroundColor: '#FF3D00',
              fontSize: 20,
              height: 40,
              color: 'white',
              border: '2px solid white',
              borderRadius: '0px'
            }}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Joining in...' : 'Join the club'}
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
