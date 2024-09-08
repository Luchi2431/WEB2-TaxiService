import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from "./Components/FrontPage/FrontPage";
import Register from "./Components/Authentication/Register";
import { GoogleLogin } from '@react-oauth/google';
import Dashboard from './Components/FrontPage/Dashboard'

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<FrontPage />} />
              <Route path="/dashboard/*" element={<Dashboard/>} />
          </Routes>
      </Router>
  );


}

export default App;
