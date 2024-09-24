import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Row, Col } from 'react-bootstrap';
import Logo from '../../assets/login.jpg';
import Cinema from '../../assets/cinemaElk.png';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'; // Ant Design icons
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

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
        setError('');
        setFailedAttempts(0);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        setError('Login failed. Please check your credentials.');
        setFailedAttempts((prevAttempts) => prevAttempts + 1);
        if (failedAttempts + 1 >= 2) {
          setShowForgotPassword(true);
        }
        console.error('Error logging in:', error);
      });
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log(result.user);
        setLoading(false);
        setError('');
        setFailedAttempts(0);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        setError('Google sign-in failed. Please try again.');
        console.error('Error with Google login:', error);
      });
  };

  const handleResetPassword = () => {
    navigate('/resetPassword')
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
            <div className="password-input-container" style={{ position: 'relative', width: '100%' }}>
              <Input
                onChange={(e) => setPassword(e.currentTarget.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                className='enter-pass-input'
                style={{ height: 40, paddingRight: '40px' }} // Space for the eye icon
                placeholder="Enter your password"
              />
              <span
                onClick={toggleShowPassword}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>

          </div>
          {error && <div style={{ color: 'white', textAlign: 'center' }}>{error}</div>}
          <Button
            className='google-login-button '
            onClick={handleLogin}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            className='google-login-button '
            onClick={handleGoogleLogin}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login with Google'}
          </Button>

          {/* Show the forgot password link after 2 failed login attempts */}
          {showForgotPassword && (
            <p
              className="navgate-link mt-1"
            >
              Forgot your password?
              <span
                className="span-reset"
                onClick={handleResetPassword}>
                Reset here
              </span>
            </p>
          )}
          <p className='navgate-link mt-1'>
            Join the club?{' '}
            <span onClick={handleJoinClub} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Click here
            </span>
          </p>
        </Col>
      </Row>
    </div>
  );
}
