import "./App.css";
import { useState } from "react";

//https://www.npmjs.com/package/openai
import OpenAI from "openai";
//https://www.npmjs.com/package/translate
import translate from "translate";
//https://manage.talkify.net/
import "talkify-tts";
//https://www.npmjs.com/package/react-speech-recognition
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const openai = new OpenAI({
  organization: "org-cEC4INxsgMtKfNh3z6NItl8m",
  project: "proj_GTKrQcUnol2uPXmpqbJvcVEF",
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

translate.engine = "google";
const toTranslatePrefix = "cómo se dice";
const toTranslatePrefixTwo = "como se dice";
const fromTranslatePrefix = "qué quiere decir esto";

window.talkify.config.remoteService.host = "https://talkify.net";
window.talkify.config.remoteService.apiKey =
  "fe23fef8-f813-4d0f-b392-8212bb17a9c8";
const tts = new window.talkify.TtsPlayer();
tts.forceVoice({ name: "Hilda" });

function App() {
  const [history, setHistory] = useState([]);
  const [dictateEnglish, setDictateEnglish] = useState([]);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  async function send(message) {
    let newItem = { sender: "You", message: message };
    setHistory((h) => [...h, newItem]);

    message = message.toLowerCase();

    if (
      message.startsWith(toTranslatePrefix) ||
      message.startsWith(toTranslatePrefixTwo)
    )
      await toTranslate(message);
    else if (message.startsWith(fromTranslatePrefix))
      await fromTranslate(message);
    else await toGpt(message);
  }

  async function toTranslate(message) {
    const truncatedMessage = message.slice(toTranslatePrefix.length).trim();
    const translated = await translate(truncatedMessage, {
      to: "es",
      from: "en",
    });
    const newResponse = `Para decir '${truncatedMessage}' en español, se dice '${translated}'`;
    deliverResponse(newResponse);
  }

  async function fromTranslate(message) {
    const truncatedMessage = message.slice(fromTranslatePrefix.length).trim();
    const translated = await translate(truncatedMessage, {
      to: "en",
      from: "es",
    });
    const newResponse = `En español, '${truncatedMessage}' significa '${translated}'`;
    await deliverResponse(newResponse);
  }

  async function toGpt(message) {
    const contextAndMessage =
      "reply as in a conversation with a friend. " + message;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: contextAndMessage }],
      temperature: 0,
      max_tokens: 250,
    });
    const newResponse = response.choices[0].message.content;
    await deliverResponse(newResponse);
  }

  async function deliverResponse(newResponse) {
    let newItem = { sender: "Hilda", message: newResponse };
    setHistory((h) => [...h, newItem]);

    tts.playText(newResponse);
  }

  function onPress() {
    if (listening) {
      SpeechRecognition.stopListening();
      send(transcript);
    } else {
      setDictateEnglish(false);
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: "es-MX",
      });
    }
  }

  if (
    !dictateEnglish &&
    (transcript.startsWith(toTranslatePrefix) ||
      transcript.startsWith(toTranslatePrefixTwo))
  ) {
    setDictateEnglish(true);
    SpeechRecognition.stopListening();
    setTimeout(
      () =>
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-NZ",
        }),
      750
    );
  }

  return (
    <div className="App">
      <div>
        {history.map((i, idx) => (
          <p key={idx}>
            {i.sender}: {i.message}
          </p>
        ))}
      </div>
      <hr />
      <i>{transcript || "Say hi!"}</i>
      <div className={`mic ${listening ? "on" : "off"}`} onClick={onPress} />
    </div>
  );
}

export default App;
