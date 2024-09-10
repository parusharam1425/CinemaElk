import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Row, Col } from 'react-bootstrap';
import Logo from '../../assets/login.jpg';
import Cinema from '../../assets/cinemaElk.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinClub = (e) => {
    e.preventDefault(); // Prevent default behavior if needed
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

  return (
    <div className='main-container'>
      <Row>
        <Col xl={6} xs={12}>
        <div className='login-image'>

          <img src={Logo} alt="Login" />
          </div>
        </Col>
        <Col xl={6}  xs={12} className='form-card'>
          <div className="cinema-image">
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
          {error && <div style={{ color: 'white', textAlign:'center' }}>{error}</div>}
          <Button
            className='login-button'
            onClick={handleLogin}
            style={{
              width: 500,
              margin: 20,
              backgroundColor: '#FF3D00',
              fontSize: 20,
              height: 40,
              color: 'white',
              border: '2px solid white',
              borderRadius:'0px'
            }}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <p className='navgate-link'>
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
