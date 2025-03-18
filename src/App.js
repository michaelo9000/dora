import { useState } from "react";

import "./App.css";
import Chat from "./pages/chat";
import Practice from "./pages/practice";
import WordList from "./pages/wordList";

function App() {
  const [error, setError] = useState();
  const [rulesOpen, setRulesOpen] = useState();
  const [page, setPage] = useState('practice');

  console.log(rulesOpen);

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
        {error && <div className="header-control" onClick={() => setError("")}>X</div>}
        {!error && <div className="header-control" onClick={() => setRulesOpen(true)}>i</div>}
      </div>
      <Modal open={rulesOpen} toggle={setRulesOpen}/>
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

function Modal(props){
  if (!props.open)
    return;

  return <div className="modal">
    <div className={`content-row header`}>
      <p>Rules and Info</p>
      <div className="header-control" onClick={() => props.toggle(false)}>X</div>
    </div>
    <div className="modal-body">
      <div className={`content-row`}>
        <p>Present continuous</p>
      </div>
      <div className={`content-row`}>
        <p>I am eating:</p>
        <p>Estoy comiendo</p>
      </div>
      <div className={`content-row`}>
        <p>I am thinking:</p>
        <p>Estoy pensando</p>
      </div>
      <div className={`content-row`}>
        <p>Present perfect</p>
      </div>
      <div className={`content-row`}>
        <p>I have eaten:</p>
        <p>He comido</p>
      </div>
      <div className={`content-row`}>
        <p>I have thought:</p>
        <p>He pensado</p>
      </div>
      <div className={`content-row`}>
        <p>Future simple</p>
      </div>
      <div className={`content-row`}>
        <p>I will eat:</p>
        <p>Comeré</p>
      </div>
      <div className={`content-row`}>
        <p>I will think:</p>
        <p>Pensaré</p>
      </div>
    </div>
  </div>
}