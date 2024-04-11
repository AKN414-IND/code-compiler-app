import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './landingpage.css';
import logo from './logo512.png'; // Import your logo
import featureImage1 from './logo512.png'; // Import a relevant image for the Web IDE feature
import featureImage2 from './logo512.png'; // Import a relevant image for the Code Editor feature

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000 // Global animation duration
    });
  }, []);

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="nav-brand">
          <img src={logo} alt="CodeCompiler logo" className="logo" />
          CodeCompiler
        </div>
      </nav>
      <header className="landing-header" data-aos="fade-up">
        <h1 className="landing-title">Unleash Your Coding Potential</h1>
        <p className="landing-subtitle">
          Write, compile, and execute your code in a powerful and intuitive environment.
        </p>
      </header>
      <section className="features-container">
        <div className="feature" data-aos="fade-right">
          <h2>Web IDE</h2>
          <img src={featureImage1} alt="Web IDE" className="feature-image" />
          <p>
            Compile HTML, CSS, and JavaScript on the fly with our powerful Web IDE.
          </p>
          <Link to="/webide" className="btn btn-secondary">
            Launch Web IDE
          </Link>
        </div>
        <div className="feature" data-aos="fade-left">
          <h2>Code Editor</h2>
          <img src={featureImage2} alt="Code Editor" className="feature-image" />
          <p>
            Write code in your favorite programming languages with syntax highlighting
            and powerful features.
          </p>
          <Link to="/codeide" className="btn btn-secondary">
            Open Code Editor
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default LandingPage;