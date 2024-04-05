import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css'; // Ensure this path matches the location of your CSS file

const LandingPage = () => {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="nav-brand">CodeCompiler</div>
      </nav>
      <header className="landing-header">
        <h1 className="landing-title">Discover Your Coding Potential</h1>
        <p className="landing-subtitle">Write, compile, and execute your code all in one place.</p>
        
      </header>
      <section className="features-container">
        <div className="feature">
          <h2>Web IDE</h2>
          <p>Compile HTML, CSS, and JavaScript on the fly.</p>
          <Link to="/webide" className="btn btn-secondary">Launch Web IDE</Link>
        </div>
        <div className="feature">
          <h2>Code Editor</h2>
          <p>Supports multiple programming languages with syntax highlighting.</p>
          <Link to="/codeide" className="btn btn-secondary">Open Code Editor</Link>
        </div>
      </section>
      <footer className="landing-footer">
      </footer>
    </div>
  );
};

export default LandingPage;
