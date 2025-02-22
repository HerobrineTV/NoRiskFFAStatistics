// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React from 'react';

// Components
import Navbar from "./components/navbar/Navbar";

// Pages
import NotFound from './pages/home/home';
import Start from './pages/home/home';
import Player from './pages/player/player';

// Styles and assets
import './App.css';

const RedirectToDefaultLang = () => {
  let location = useLocation();
  const pathParts = location.pathname.split('/');
  if (pathParts.length < 2 || pathParts[1] === "") {
    return <Navigate to="/home" replace />;
  }
  return null;
};

const App = () => {
  return (
    <Router>
      <div className="default-div">
        <Navbar />
        <Routes>
          <Route path="/" element={<RedirectToDefaultLang />} />
          <Route path="home" element={<Start />} />
          <Route path="player/:id" element={<Player />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;