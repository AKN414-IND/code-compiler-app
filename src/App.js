import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { saveAs } from 'file-saver';
import { FiDownload, FiUploadCloud } from "react-icons/fi";
import { BsPlayFill } from "react-icons/bs";
import "./App.css";
import Editor2 from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [cpuTime, setCpuTime] = useState("0ms");
  const [memory, setMemory] = useState("0KB");
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    const guessLanguage = (code) => {
      if (/class\s+\w+\s*\{/.test(code)) return "java";
      if (/def\s+\w+\s*\(/.test(code)) return "python";
      if (/function\s+\w+\s*\(/.test(code)) return "javascript";
      if (/int main\s*\(/.test(code)) return "c";
      else if (/#include/.test(code)) return "cpp";
      return "plaintext";
    };
    setLanguage(guessLanguage(inputText));
  }, [inputText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      url: "https://online-code-App.p.rapidapi.com/v1/",
      headers: {
        "content-type": "Application/json",
        "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "online-code-App.p.rapidapi.com",
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
      case "python": return "py";
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
      const fileExtension = file.name.split('.').pop();
      const mappedLanguage = mapFileExtensionToLanguage(fileExtension);
      setLanguage(mappedLanguage);

      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const mapFileExtensionToLanguage = (extension) => {
    const extensionToLanguageMap = {
      py: "python",
      c: "c",
      cpp: "cpp",
      java: "java",
      js: "javascript",
    };
    return extensionToLanguageMap[extension] || "plaintext";
  };

  const getMonacoLanguageId = (language) => {
    return language;
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="Language-select-container">
          <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)} className="Language-select">
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
          <div className="same-line">
            <button className="Download-button" onClick={handleDownload}><FiDownload /> Download</button>
            <button className="Run-button" onClick={handleSubmit} disabled={buttonClicked}>{buttonClicked ? "Running..." : "Run"} <BsPlayFill /></button>
            <input type="file" onChange={handleFileImport} style={{ display: 'none' }} id="file-import" accept=".txt,.js,.py,.java,.cpp,.c" />
            <label htmlFor="file-import" className="Import-button"><FiUploadCloud /> Import</label>
          </div>
        </div>
      </header>
      <div className="App-body">
        <div className="left-column">
          <Editor height="50vh" language={getMonacoLanguageId(language)} value={inputText} onChange={setInputText} theme="vs-dark" options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            highlightActiveIndentGuide: true,
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'full',
            formatOnType: true,
            formatOnPaste: true,
          }} />
        </div>
        <div className="right-column">
          <Editor2 className="Editor Editor-input" value={inputValue} onValueChange={setInputValue} highlight={(code) => highlight(code, languages.js)} padding={10} />
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
