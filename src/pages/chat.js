import { useState } from "react";

// import { openai } from "../infra/openai";
import { translateLayer as translate } from "../infra/translate";
import { normalise } from "../infra/stringFunctions";
import { tts } from '../infra/tts';

import { SpeechInput } from "../infra/speechInput";

function Chat(props) {
  const [history, setHistory] = useState([]);
  const [transcript, setTranscript] = useState();

  async function processSpeechInput(transcript) {
    setTranscript(transcript);
    
    let newItem = { sender: "You", message: transcript };
    setHistory((h) => [...h, newItem]);

    transcript = normalise(transcript);

    var response;

    if (transcript.startsWith(translate.howToSayPrefix))
      response = await translate.getHowToSay(transcript);
    else if (transcript.startsWith(translate.whatThatMeansPrefix))
      response = await translate.getMeaning(transcript);
    else 
      response = await toGpt(transcript);

    await deliverResponse(response);
  }

  async function toGpt(message) {
    return "sorry! hilda is away at the moment. (the openAI key needs updating)";
    // const contextAndMessage =
    //   "reply as in a conversation with a friend. " + message;
    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: contextAndMessage }],
    //   temperature: 0,
    //   max_tokens: 250,
    // });
    // return response.choices[0].message.content;
  }

  async function deliverResponse(newResponse) {
    let newItem = { sender: "Hilda", message: newResponse };
    setHistory((h) => [...h, newItem]);
    tts.playText(newResponse);
  }

  if (!props.isActive) 
    return <></>

  return (
    <div className="chat-body">
      <div>
        {history.map((i, idx) => (
          <p key={idx}>
            {i.sender}: {i.message}
          </p>
        ))}
      </div>
      {!history.length && <i>{"Say hi!"}</i>}
      <SpeechInput callback={processSpeechInput}/>
    </div>
  );
}

export default Chat;