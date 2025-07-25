import React, { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript"; // For JavaScript highlighting
import "./App.css";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

const sampleCode = `
function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("Lalit"));
`;

const App = () => {
  const codeRef = useRef(null);
  const [code, setcode] = useState("");
  const [review, setreview] = useState("");
  const [loading , setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post( `${backendUrl}/ai/get-review` , {
        code,
      });

      setLoading(false)
      setreview(response.data);
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const clean=()=>{
    setcode('')
    setreview('')
  }

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <main>
      <div className="left">
        {/* Code block for PrismJS */}
        <div className="code">
          
          <Editor
            value={code}
            onValueChange={(code) => setcode(code)}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.javascript, "javascript")
            }
            style={{
              fontFamily: '"Fira mono" , "Fira code" , monospace',
              fontSize: 16,
              
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "100%",
              width: "100%",
            }}
          />

          {code === '' && <span id="preview"> Type or Paste your code here </span>}

          {/* Review button */}
          <button onClick={reviewCode} className="review">
            {loading ? 'please wait' : 'review'}
          </button>
          <button onClick={clean} className="clean">
            Clear
          </button>
        </div>
      </div>

      {/* Summary output area */}
      <div className="right">
        {code === '' && <p>Submit some code to see the review here</p>}
        {loading && code!='' ? <p> Please wait while the review is generating </p> : <Markdown
        rehypePlugins={[rehypeHighlight]}
        >{review}</Markdown>}

      </div>
    </main>
  );
};

export default App;
