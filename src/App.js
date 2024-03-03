import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { saveAs } from "file-saver";
import { FiDownload, FiUploadCloud } from 'react-icons/fi';
import { BsPlayFill } from "react-icons/bs";
import "./App.css";
import Editor2 from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";

const themeVariables = {
  light: {
    '--background-color': '#FFFFFF',
    '--text-color': '#000000',
    '--button-bg-color': '#0077B6',
    '--selector-bg-color': '#00B4D8',
    '--button-text-color': '#FFFFFF',
    '--border-color': '#0077B6',
    '--output-bg-color': '#fffff'
    
  },
  dark: {
    '--background-color': '#000000',
    '--text-color': '#FFFFFF',
    '--button-bg-color': '#3F72AF',
    '--selector-bg-color': '#00B4D8',
    '--button-text-color': '#FFFFFF',
    '--border-color': '#3F72AF',
    '--output-bg-color': '#43434391'
  }
};


function App() {
  const [inputText, setInputText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("c");
  const [cpuTime, setCpuTime] = useState("0ms");
  const [memory, setMemory] = useState("0KB");
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState("dark");
  const fileInputRef = useRef(null);

  

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    Object.keys(themeVariables[theme]).forEach(property => {
      document.documentElement.style.setProperty(property, themeVariables[theme][property]);
    });
  }, [theme]);
  const handleToggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");


  useEffect(() => {
    const guessLanguage = (code) => {
      if (/class\s+\w+\s*\{/.test(code)) return "java";
      if (/function\s+\w+\s*\(/.test(code)) return "javascript";
      if (/#include <iostream>/.test(code)) return "cpp";
      if (/int main\s*\(/.test(code)) return "c";
      return "python3";
    };
    setLanguage(guessLanguage(inputText));
  }, [inputText]);



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
        language: language === "python" ? "python3" : language,
        version: "latest",
        code: inputText,
        input: inputValue,
      },
    };


    try {
      setIsRunning(true);
      const response = await axios.request(options);
      setIsRunning(false);
      setCpuTime(`${response.data.cpuTime}ms`);
      setMemory(`${response.data.memory}KB`);
      setOutput(response.data.output);
    } catch (error) {
      setIsRunning(false);
      console.error(error);
      setOutput("An error occurred while compiling the code.");


    }
  };

  
  const getFileExtension = (language) => {
    switch (language) {
      case "python3":
        return "py";
      case "c":
        return "c";
      case "cpp":
        return "cpp";
      case "java":
        return "java";
      case "javascript":
        return "js";
      default:
        return "txt";
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
      const fileExtension = file.name.split(".").pop();
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
      py: "python3",
      c: "c",
      cpp: "cpp",
      java: "java",
      js: "javascript",
    };
    return extensionToLanguageMap[extension] || "plaintext";
  };

  const getMonacoLanguageId = (language) => {
    const languageToMonacoMap = {
      python3: "python",
      c: "c",
      cpp: "cpp",
      java: "java",
      javascript: "javascript",
    };
    return languageToMonacoMap[language] || "plaintext";
  };

  return (
    <div className="App">
      <header className="App-header">
        <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="Language-select"
          >
            <option value="c">C</option>
            <option value="python3">Python3</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
        <button className="option-button" onClick={handleToggleTheme}>Toggle Theme</button>
        <button className="option-button" onClick={handleDownload}><FiDownload /> Download</button>
        <button className="option-button" onClick={handleSubmit} disabled={isRunning}>{isRunning ? "Running..." : "Run"} <BsPlayFill /></button>
        <input type="file" ref={fileInputRef} onChange={handleFileImport} style={{ display: "none" }} accept=".txt,.js,.py,.java,.cpp,.c" />
        <button className="option-button" onClick={() => fileInputRef.current.click()}><FiUploadCloud /> Import</button>
      </header>
      <div className="App-body">
        <div className="left-column">
        <Editor
              height="87vh"
              language={getMonacoLanguageId(language)}
              value={inputText}
              onChange={setInputText}
              theme={theme === "dark" ? "vs-dark" : "light"}
              options={{
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: "line",
                automaticLayout: true,
                highlightActiveIndentGuide: true,
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                autoIndent: "full",
                formatOnType: true,
                formatOnPaste: true,
              }}
            />
        </div>
        <div className="right-column">
          <Editor2 className="Editor2"value={inputValue} onValueChange={setInputValue} highlight={(code) => highlight(code, languages.js)} padding={10} />
          <div className="Output-area"><pre>{output}</pre></div>
          <div className="Statistics-area">
          <div className="Stat-box">
                <h3 className="Stat-title">Execution Time</h3>
                <p className="Stat-value">{cpuTime}</p>
              </div>
              <div className="Stat-box">
                <h3 className="Stat-title">Memory Usage</h3>
                <p className="Stat-value">{memory}</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
