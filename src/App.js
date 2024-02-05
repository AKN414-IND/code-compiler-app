// App.js
import React, { useState } from "react";
import axios from "axios";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css"; // A nicer theme for the code editor
import "./App.css"; // Make sure to update your CSS accordingly
import { saveAs } from 'file-saver';
import { FiDownload, FiUploadCloud } from "react-icons/fi"; // Icons for download and upload
import { BsPlayFill } from "react-icons/bs"; // Icon for run

function App() {
  const [inputText, setInputText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python3");
  const [cpuTime, setCpuTime] = useState("0ms");
  const [memory, setMemory] = useState("0KB");
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      url: "https://online-code-compiler.p.rapidapi.com/v1/",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "online-code-compiler.p.rapidapi.com",
      },
      data: {
        language: language,
        version: "latest",
        code: inputText,
        input: inputValue,
      },
    };
    try {
      setButtonClicked(true);
      const response = await axios.request(options);
      setButtonClicked(false);
      setCpuTime(response.data.cpuTime + "ms");
      setMemory(response.data.memory + "KB");
      setOutput(response.data.output);
    } catch (error) {
      setButtonClicked(false);
      console.error(error);
      setOutput("An error occurred while compiling the code.");
    }
  };

  const getFileExtension = (language) => {
    switch (language) {
      case "python3": return "py";
      case "c": return "c";
      case "cpp": return "cpp";
      case "java": return "java";
      case "javascript": return "js";
      default: return "txt";
    }
  };

  const handleDownload = () => {
    const fileExtension = getFileExtension(language);
    const blob = new Blob([inputText], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `code.${fileExtension}`);
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target.result); 
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="Language-select-container">
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="Language-select"
          >
            <option value="python3">Python 3</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>

          <button className="Download-button" onClick={handleDownload}>
            <FiDownload /> Download Code
          </button>
          <button className="Run-button" onClick={handleSubmit} disabled={buttonClicked}>
            {buttonClicked ? "Running..." : <BsPlayFill />} Run Code
          </button>
          <input
            type="file"
            onChange={handleFileImport}
            style={{ display: 'none' }}
            id="file-import"
            accept=".txt,.js,.py,.java,.cpp,.c"
          />
          <label htmlFor="file-import" className="Import-button">
            <FiUploadCloud /> Import Code
          </label>
        </div>
      </header>
      <div className="App-body">
        <div className="left-column">
          <Editor
            className="Editor Editor-code"
            value={inputText}
            onValueChange={setInputText}
            highlight={(code) => highlight(code, languages.js)}
            padding={10}
          />
          
        </div>
        <div className="right-column">
        <Editor
            className="Editor Editor-input"
            value={inputValue}
            onValueChange={setInputValue}
            highlight={(code) => highlight(code, languages.js)}
            padding={10}
          />
          <div className="Output-area">
            <pre className="Output-text">{output}</pre>
          </div>
          <div className="Statistics-area">
            <h2>Complexity</h2> 
            <div className="Stat-left">
              <h3>Time</h3>
              <p>{cpuTime}</p>
            </div>
            <div className="Stat-right">
              <h3>Space</h3>
              <p>{memory}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
