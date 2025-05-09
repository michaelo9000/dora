import { useState } from "react";

import "./App.css";
import Chat from "./pages/chat";
import Practice from "./pages/practice";
import WordList from "./pages/wordList";

function App() {
  const [error, setError] = useState();
  const [rulesOpen, setRulesOpen] = useState();
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
        <p style={{textDecoration:'underline'}}>Present continuous</p>
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
        <p style={{textDecoration:'underline'}}>Present perfect</p>
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
        <p style={{textDecoration:'underline'}}>Future simple</p>
      </div>
      <div className={`content-row`}>
        <p>I will eat:</p>
        <p>Comeré</p>
      </div>
      <div className={`content-row`}>
        <p>I will think:</p>
        <p>Pensaré</p>
      </div>
      <div className={`content-row`}>
        <p style={{textDecoration:'underline'}}>Present conditional</p>
      </div>
      <div className={`content-row`}>
        <p>Would like:</p>
        <p>Gustar -ía, -ías, -ían, -íamos</p>
      </div>
      <div className={`content-row`}>
        <p>Many common verbs in this tense are irregular:</p>
      </div>
      <div className={`content-row`}>
        <p>
          <span className="strike">Podería</span> Podría - 
          <span className="strike">Tenería</span> Tendría -
          <span className="strike">Deciría</span> Diría 
        </p>
      </div>
      <div className={`content-row`}>
        <p style={{textDecoration:'underline'}}>Past continuous</p>
      </div>
      <div className={`content-row`}>
        <p>Was eating:</p>
        <p>Com -ía, -ías, -ían, -íamos</p>
      </div>
      <div className={`content-row`}>
        <p>Was speaking:</p>
        <p>Habl -aba, -abas, -aban, -abamos</p>
      </div>
    </div>
  </div>
}