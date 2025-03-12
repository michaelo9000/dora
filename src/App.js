import { useState } from "react";

import "./App.css";
import Chat from "./pages/chat";
import Practice from "./pages/practice";
import WordList from "./pages/wordList";

function App() {
  const [error, setError] = useState();
  const [page, setPage] = useState('practice');

  function getHeaderText(){
    if (error)
      return error;
    switch (page){
      case "wordlist":
        return "Manage your vocabulary";
      case "practice":
        return "Form sentences from the given words";
      case "chat":
        return "Chat with Hilda";
      default: 
        return "Dora";
    }
  }
  
  return (
    <div className="App">
      <div className={`content-row header ${error ? 'error-banner' : ''}`}>
        <p>{getHeaderText()}</p>
        {error && <div className="pointer" style={{fontSize:24}} onClick={() => setError("")}>x</div>}
      </div>
      <WordList reportError={setError} isActive={page === 'wordlist'}/>
      <Practice reportError={setError} isActive={page === 'practice'}/>
      <Chat reportError={setError} isActive={page === 'chat'}/>
      <div className="nav">
        <div className={`nav-item word-list ${page === 'wordlist' ? 'active' : ''}`} onClick={() => setPage('wordlist')}></div>
        <div className={`nav-item practice ${page === 'practice' ? 'active' : ''}`} onClick={() => setPage('practice')}></div>
        <div className={`nav-item chat ${page === 'chat' ? 'active' : ''}`} onClick={() => setPage('chat')}></div>
      </div>
    </div>
  );
}

export default App;
