import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { translateLayer as translate } from "../infra/translate";
import { SpeechInput } from "../infra/speechInput";
import { db, WordTypes } from "../infra/data";

function Practice(props) {
  const [history, setHistory] = useState([]);
  const [currentWords, setCurrentWords] = useState([]);
  const knownWords = useLiveQuery(() => db.words.toArray());

  // Get some words on initial load. After this they'll be retrieved by pressing the button.
  // TODO change to initiate with the button too.
  if (!currentWords.length && knownWords && knownWords.length)
    getWords();

  function getWords(){
    var nouns = knownWords.filter(i => i.type*1 === WordTypes.Noun);
    var noun = nouns[Math.floor(Math.random() * nouns.length)];
    var verbs = knownWords.filter(i => i.type*1 === WordTypes.Verb);
    var verb = verbs[Math.floor(Math.random() * verbs.length)];
    var adjectives = knownWords.filter(i => i.type*1 === WordTypes.Adjective);
    var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    setCurrentWords([noun, verb, adjective]);
  }

  async function processSpeechInput(transcript, isFinal) {
    if (!transcript){
      props.reportError('You didn`t say anything pendejo');
      return;
    }

    if (isFinal){
      let translatedEnglish = await translate.spanishToEnglish(transcript);
      let doubleTranslatedSpanish = await translate.englishToSpanish(translatedEnglish);

      let newItem = { 
        words: currentWords, 
        yourSentence: transcript, 
        inEnglish: translatedEnglish, 
        inSpanish: doubleTranslatedSpanish 
      };
      setHistory((h) => [...h, newItem]);
      getWords();
    }
  }

  if (!props.isActive) 
    return <></>

  return (
    <>
    <div className="practice-body">
      {history.map((i, idx) => 
        <HistoryItem key={idx} idx={idx} i={i}/>
      )}
      <p>Use these words, or forms of them, in a sentence:</p>
      <div className="content-row around">
        {currentWords.map((i, idx) => <p key={idx} className="word-prompt">{i.value}</p>)}
      </div>
    </div>
    <SpeechInput callback={processSpeechInput}/>
    </>
  );
}

export default Practice;

function HistoryItem(props){
  const [collapsed, setCollapsed] = useState();

  let i = props.i;
  
  return <div key={props.idx} style={{borderBottom: '1px solid black', paddingBottom:10}}>
    <div className="content-row around">
      {i.words.map((i, idx) => <i key={idx} className="word-prompt">{i.value}</i>)}
    </div>
    <div className="speech-result">
      <div className="heading">You said</div>
      <p className="body">{i.yourSentence}</p>
    </div>
    {collapsed ? 
      <div className="translations-toggle" onClick={() => setCollapsed(false)}>Show Translations</div>
      :
      <>
      <div className="speech-result">
        <div className="heading">In English</div>
        <p className="body">{i.inEnglish}</p>
      </div>
      <div className="speech-result">
        <div className="heading">In Spanish</div>
        <p className="body">{i.inSpanish}</p>
      </div>
      <div className="translations-toggle" onClick={() => setCollapsed(true)}>Hide Translations</div>
      </>
    }
  </div>
}