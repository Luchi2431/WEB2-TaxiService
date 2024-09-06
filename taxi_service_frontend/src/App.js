import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from "./Components/FrontPage/FrontPage";
import Register from "./Components/Authentication/Register";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<FrontPage />} />
          </Routes>
      </Router>
  );
}

export default App;
