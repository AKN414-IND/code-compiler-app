import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="landing-title">Discover Your Coding Potential</h1>
        <p className="landing-subtitle">Whether you're a beginner or an expert, our interactive coding environment is designed for all levels.</p>
      </header>
      <div className="ide-container">
        <div className="ide ide-web" >
          <div className="ide-content">
            <h2>Web IDE</h2>
            <p>Edit and run your HTML, CSS, and JavaScript code all in one place. Experience the ease of testing and debugging with live previews.</p>
            <Link to="/webide" className="ide-link">Start Coding</Link>
          </div>
        </div>
        <div className="ide ide-code" >
          <div className="ide-content">
            <h2>Code IDE</h2>
            <p>Powerful code editor for C, C++, Java, Python, and more. Dive into development with advanced features and a vast language support.</p>
            <Link to="/codeide" className="ide-link">Open Editor</Link>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default LandingPage;
