import React, { useState, useEffect } from 'react';
import './webide.css'; // Ensure the path to your CSS file is correct

const WebIde = () => {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState('html');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>${html}<script>${js}</script></body>
        </html>
      `);
    }, 250);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const handleDownload = (filename, content) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const downloadFiles = () => {
    handleDownload('index.html', html);
    handleDownload('style.css', css);
    handleDownload('script.js', js);
  };

  

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
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
          alert('Unsupported file type');
        }
      };
      reader.readAsText(file);
    }
  };
  const openPreviewInNewTab = () => {
    const newWindow = window.open();
    newWindow.document.write(srcDoc);
  };

  return (
    <div className='ide-container'>
      <div className='toolbar'>
      <input
          type='file'
          id='fileInput'
          style={{ display: 'none' }}
          onChange={handleImport}
          accept='.html,.css,.js'
        />
        <button onClick={() => document.getElementById('fileInput').click()}>
          Import Files
        </button>

        <button onClick={downloadFiles}>Download Project</button>
        <button onClick={openPreviewInNewTab}>Open Preview in New Tab</button>
      </div>
      <div className='main'>
      <div className='editor-container'>
        <div className="tab-header">
          <div
            className={`tab-title ${activeTab === "html" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("html")}
          >
            index.html
          </div>
          <div
            className={`tab-title ${activeTab === "css" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("css")}
          >
            style.css
          </div>
          <div
            className={`tab-title ${activeTab === "js" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("js")}
          >
            script.js
          </div>
        </div>
        <textarea
          className="editor"
          value={activeTab === "html" ? html : activeTab === "css" ? css : js}
          onChange={(e) =>
            activeTab === "html"
              ? setHtml(e.target.value)
              : activeTab === "css"
              ? setCss(e.target.value)
              : setJs(e.target.value)
          }
          placeholder={`Write your ${activeTab}`}
        />
      </div>
      <div className="preview-container">
        <iframe
          srcDoc={srcDoc}
          title="output"
          className="preview-iframe"
          sandbox="allow-scripts"
          frameBorder="0"
        />
      </div>
      </div>
    </div>
  );
};

export default WebIde;
