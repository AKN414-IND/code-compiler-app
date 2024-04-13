import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import WebIde from './components/Webide';
import CodeIde from './components/Codeide';
import './App.css';

function App() {
  return (
    <Router>
      <div className="fullscreen-component">
        <Routes> 
          <Route path="/" element={<LandingPage />} exact />
          <Route path="/webide" element={<WebIde />} />
          <Route path="/codeide" element={<CodeIde />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
