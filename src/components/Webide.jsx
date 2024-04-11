import React, { useState, useEffect } from 'react';
import './webide.css';

const WebIde = () => {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState('html');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
    }, 250);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      if (file.name.endsWith('.html')) {
        setHtml(content);
      } else if (file.name.endsWith('.css')) {
        setCss(content);
      } else if (file.name.endsWith('.js')) {
        setJs(content);
      } else {
        alert('Unsupported file type.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = (filename, content) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className='ide-container'>
      <header>
        <div className="tab-header">
          {['html', 'css', 'js'].map((type) => (
            <div key={type} 
                 className={`tab-title ${activeTab === type ? "active-tab" : ""}`} 
                 onClick={() => setActiveTab(type)}>
              {type.toUpperCase()}
            </div>
          ))}
        </div>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={(e) => handleFileRead(e.target.files[0])}
          accept=".html, .css, .js"
        />
        <button onClick={() => document.getElementById('fileInput').click()}>
          Import Files
        </button>
        <button onClick={() => {
          handleDownload('index.html', html);
          handleDownload('style.css', css);
          handleDownload('script.js', js);
        }}>
          Download Project
        </button>
        <button onClick={() => window.open().document.write(srcDoc)}>
          Open Preview
        </button>
      </header>
      <div className='main'>
        <div className='editor-container'>
          <textarea
            className="editor"
            value={activeTab === "html" ? html : activeTab === "css" ? css : js}
            onChange={(e) => {
              const newValue = e.target.value;
              if (activeTab === 'html') setHtml(newValue);
              else if (activeTab === 'css') setCss(newValue);
              else setJs(newValue);
            }}
            placeholder={`Write your ${activeTab.toUpperCase()}`}
          />
        </div>
        {isMobileView && (
          <div className="preview-container">
            <iframe
                srcDoc={srcDoc}
                title="preview"
                frameBorder="0"
                sandbox="allow-scripts"
                className="preview-iframe"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebIde;
