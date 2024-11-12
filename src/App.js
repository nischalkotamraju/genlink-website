import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/firebase-config';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Register from './views/Register';
import Header from './components/Header';
import Home from './views/Home';
import Footer from './components/Footer';
import Contact from './views/Contact';
import AdminDashboard from './views/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <Router>
      <div className="App bg-[#0e1e4b] min-h-screen text-white">
      <Header />
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to={isAdmin ? "/admindashboard" : "/dashboard"} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={isAdmin ? "/admindashboard" : "/dashboard"} />} />
          <Route path="/dashboard" element={user ? (isAdmin ? <Navigate to="/admindashboard" /> : <Dashboard />) : <Navigate to="/login" />} />
          <Route path="/admindashboard" element={user && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />          
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      <Footer />
      </div>
    </Router>
  );}

export default App;