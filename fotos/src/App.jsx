import React from 'react';
import Home from './pages/Home.jsx'
import MainDashboard from './pages/Important.jsx'
import './styles/output.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<MainDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
