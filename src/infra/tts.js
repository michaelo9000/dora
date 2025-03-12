
//https://manage.talkify.net/
import "talkify-tts";

window.talkify.config.remoteService.host = "https://talkify.net";
window.talkify.config.remoteService.apiKey =
  "fe23fef8-f813-4d0f-b392-8212bb17a9c8";
const textToSpeech = new window.talkify.TtsPlayer();
textToSpeech.forceVoice({ name: "Hilda" });

export const tts = textToSpeech;