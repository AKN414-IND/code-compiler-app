import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use 'Switch' instead of 'Routes' if you're using React Router v5
import LandingPage from './components/LandingPage';
import WebIde from './components/Webide';
import CodeIde from './components/Codeide';
import './App.css';

function App() {
  return (
    <Router>
<div className="fullscreen-component">
        <Routes> {/* Use 'Switch' here if you're using React Router v5 */}
          <Route path="/" element={<LandingPage />} exact />
          <Route path="/webide" element={<WebIde />} />
          <Route path="/codeide" element={<CodeIde />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
