import { useCallback, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { translateLayer as translate } from "../infra/translate";
import { SpeechInput } from "../infra/speechInput";
import { db, WordTypes } from "../infra/data";

function Practice(props) {
  const [transcript, setTranscript] = useState();
  const [history, setHistory] = useState([]);
  // optimistically true until proven false.
  const [hasEnoughWords, setHasEnoughWords] = useState();
  const [currentWords, setCurrentWords] = useState([]);

  const knownWords = useLiveQuery(() => db.words.toArray());

  // Get the initial words. Following this they'll be refreshed after each sentence spoken.
  if (!currentWords.length && knownWords && knownWords.length)
    getWords();

  function getWords(){
    var nouns = knownWords.filter(i => i.type*1 === WordTypes.Noun);
    var verbs = knownWords.filter(i => i.type*1 === WordTypes.Verb);
    var adjectives = knownWords.filter(i => i.type*1 === WordTypes.Adjective);
    
    // If the user doesn't have one of each word type, return early until they do.
    if (!nouns.length || !verbs.length || !adjectives.length)
      return;

    setHasEnoughWords(true);

    var noun = nouns[Math.floor(Math.random() * nouns.length)];
    var verb = verbs[Math.floor(Math.random() * verbs.length)];
    var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    setCurrentWords([noun, verb, adjective]);
  }

  const receiveTranscriptUpdate = useCallback((transcript) => setTranscript(transcript), []);

  async function processSpeechInput(transcript) {
    if (!transcript){
      props.reportError('You didn`t say anything pendejo');
      return;
    }

    let translatedEnglish = await translate.spanishToEnglish(transcript);
    let doubleTranslatedSpanish = await translate.englishToSpanish(translatedEnglish);

    let newItem = { 
      words: currentWords, 
      yourSentence: transcript, 
      inEnglish: translatedEnglish, 
      inSpanish: doubleTranslatedSpanish 
    };
    setHistory((h) => [newItem, ...h]);
    getWords();
  }

  function retryHistoryItem(item, index){
    setCurrentWords(item.words);
    let newHistory = history;
    newHistory.splice(index, 1);
    setHistory(newHistory);
  }

  if (!props.isActive) 
    return <></>

  return (
    <>
    <div className="practice-body">
      {!hasEnoughWords && <p>Add a Noun, a Verb and an Adjective, and then return here.</p>}
      <div className="content-row around">
        {currentWords.map((i, idx) => <p key={idx} className="word-prompt">{i.value}</p>)}
      </div>
      <i>{transcript || 'Speaking at a conversational pace works best!'}</i>
      {history.map((i, idx) => 
        <HistoryItem key={idx} idx={idx} i={i} retry={retryHistoryItem}/>
      )}
    </div>
    <SpeechInput onTranscriptFinal={processSpeechInput} onTranscriptUpdate={receiveTranscriptUpdate}/>
    </>
  );
}

export default Practice;

function HistoryItem(props){
  const [collapsed, setCollapsed] = useState();

  let i = props.i;
  
  return <div key={props.idx} className="history-item">
    <div className="content-row around">
      {i.words.map((i, idx) => <i key={idx} className="word-prompt">{i.value}</i>)}
    </div>
    <div className="speech-result">
      <div className="content-row p-0">
        <div className="heading">You said</div>
        <div className="text-clickable" onClick={() => props.retry(i, props.idx)}>Remove and Retry</div>
      </div>
      <p className="body">{i.yourSentence}</p>
    </div>
    {collapsed ? 
      <div className="text-clickable mt-10" onClick={() => setCollapsed(false)}>Show Translations</div>
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
      <div className="text-clickable mt-10" onClick={() => setCollapsed(true)}>Hide Translations</div>
      </>
    }
  </div>
}