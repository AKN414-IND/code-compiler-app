import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Web Code Compiler</h1>
        <p className="landing-description">Empowering coding enthusiasts to write, compile, and execute code with style.</p>
        <div className="button-container">
          <Link to="/webide" className="btn-primary">Explore WebIDE</Link>
          <Link to="/codeide" className="btn-secondary">Try CodeIDE</Link>
        </div>
      </div>
      
    </div>
  );
};

export default LandingPage;
