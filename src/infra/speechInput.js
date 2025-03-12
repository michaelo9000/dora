
import { useState } from "react";

//https://www.npmjs.com/package/react-speech-recognition
import SpeechRecognition, {
    useSpeechRecognition,
  } from "react-speech-recognition";

import { translateLayer as translate } from "./translate";

export function SpeechInput(props){

    const [dictateEnglish, setDictateEnglish] = useState([]);
    const { transcript, listening, resetTranscript, isMicrophoneAvailable } = useSpeechRecognition();

    if (props.shouldLiveUpdate)
        props.callback(transcript, false);
    
    function onPress() {
        if (listening) {
            SpeechRecognition.stopListening();
            props.callback(transcript, true);
        } 
        else {
            setDictateEnglish(false);
            resetTranscript();
            SpeechRecognition.startListening({
                continuous: true,
                language: "es-MX",
            });
        }
    }

    if (
        // Could probably control this outside the component 
        // so that different HOCs can define their own terms for when to listen for english.
        !dictateEnglish && 
        transcript.startsWith(translate.howToSayPrefix)
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

    return <>
        {!isMicrophoneAvailable && <p>Microphone not available!</p>}
        <div className={`mic ${listening ? "on" : "off"}`} onClick={onPress} />
    </>
}