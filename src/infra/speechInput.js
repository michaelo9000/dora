
import { useEffect } from "react";

//https://www.npmjs.com/package/react-speech-recognition
import SpeechRecognition, {
    useSpeechRecognition,
  } from "react-speech-recognition";

// Do this without the state hook; it changes too slowly and I get two transcripts.
let awaitingFinalTranscript = false;

export function SpeechInput(props){
    const { transcript, finalTranscript, listening, resetTranscript, isMicrophoneAvailable } = useSpeechRecognition();

    useEffect(() => props.onTranscriptUpdate(transcript));
    
    // When transcript and final are equal, there must be no interim transcript remaining.
    if (awaitingFinalTranscript && transcript === finalTranscript){
        awaitingFinalTranscript = false;
        props.onTranscriptFinal(transcript);
        resetTranscript();
    }
    
    function onPress() {
        if (listening) {
            SpeechRecognition.stopListening();
            awaitingFinalTranscript = true;
        } 
        else {
            SpeechRecognition.startListening({
                continuous: true,
                language: "es-MX",
            });
        }
    }

    return <>
        {!isMicrophoneAvailable && <p>Microphone not available!</p>}
        <div className={`mic ${listening ? "on" : "off"}`} onClick={onPress} />
    </>
}

// old code to switch to english listening mid-transcript.
// if using, include setDictateEnglish(true); when turning the mic on.

    // import { translateLayer as translate } from "./translate";

    // const [dictateEnglish, setDictateEnglish] = useState([]);

    // if (
    //     // Could probably control this outside the component 
    //     // so that different HOCs can define their own terms for when to listen for english.
    //     !dictateEnglish && 
    //     transcript.startsWith(translate.howToSayPrefix)
    // ) {
    //     setDictateEnglish(true);
    //     SpeechRecognition.stopListening();
    //     setTimeout(
    //         () =>
    //             SpeechRecognition.startListening({
    //                 continuous: true,
    //                 language: "en-NZ",
    //             }),
    //         750
    //     );
    // }