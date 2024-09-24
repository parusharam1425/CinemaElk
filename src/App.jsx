import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import SignUp from './Components/Login/SignUp';
import Reviews from './Components/Reviews/Reviews';
import NavbarHome from './Components/Navbar/Navbar';
import Sidebar from './Components/Navbar/Sidebar';
import { Col, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Import Firebase auth
import MovieDetails from './Components/MovieDetails/MovieDetails';
import Profile from './Components/Profile/Profile';
import ResetPassword from './Components/Login/ResetPassword';
import NotFound from './Components/NotFound/NotFound';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <>
      {isLoggedIn ? (
        <Row>
          <NavbarHome handleLogout={handleLogout} />
          <Col xl={1} xs={1} >
            <Sidebar />
          </Col>
          <Col xl={11} xs={11} className='view-container mt-5'>
            <Routes>
              <Route path='/' element={<Home />} />
              {/* <Route path='/reviews/:id' element={<Reviews />} /> */}
              <Route path='/reviews' element={<Reviews />} />
              <Route path='/movie/:id' element={<MovieDetails />} />
              <Route path='/profile' element={<Profile/>} />
              <Route path='*' element={<NotFound/>} />
            </Routes>
          </Col>
        </Row>
      ) : (
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/resetPassword' element={<ResetPassword/>} />
        </Routes>
      )}
    </>
  );
}

export default App;
