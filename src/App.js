import { useState } from "react";

import "./App.css";
import Chat from "./pages/chat";
import Practice from "./pages/practice";
import WordList from "./pages/wordList";

function App() {
  const [error, setError] = useState();
  const [page, setPage] = useState('practice');

  return (
    <div className="App">
      {error &&
        <div className={`header content-row error-banner`}>
          <p>{error}</p>
          <div className="pointer" style={{fontSize:24}} onClick={() => setError("")}>x</div>
        </div>
      }
      {!error &&
        <div className="header content-row"><b>Quieres crear algunas oraciónes??</b></div>
      }
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
