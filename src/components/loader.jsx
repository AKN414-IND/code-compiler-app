import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './loader.css'; // Make sure to link to your CSS file

function CreditsLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Set the loader to stop after a set time
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading ? (
        <div className="loader">
          <div className="loader-content">
            <div className="title">Web-code Compiler</div>
            
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default CreditsLoader;
