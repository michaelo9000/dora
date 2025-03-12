
//https://www.npmjs.com/package/translate
import translate from "translate";

translate.engine = "google";
const howToSayPrefix = "como se dice";
const whatThatMeansPrefix = "cual es el significado de";

async function englishToSpanish(message) {
  return await translate(message, {
    to: "es",
    from: "en",
  });
}

async function spanishToEnglish(message) {
  return await translate(message, {
    to: "en",
    from: "es",
  });
}

async function getHowToSay(message) {
  const truncatedMessage = message.slice(howToSayPrefix.length).trim();
  const translated = await translate(truncatedMessage, {
    to: "es",
    from: "en",
  });
  return `Para decir '${truncatedMessage}' en español, se dice '${translated}'`;
}

async function getMeaning(message) {
  const truncatedMessage = message.slice(whatThatMeansPrefix.length).trim();
  const translated = await translate(truncatedMessage, {
    to: "en",
    from: "es",
  });
  return `En español, '${truncatedMessage}' significa '${translated}'`;
}

export const translateLayer = {
  howToSayPrefix: howToSayPrefix,
  whatThatMeansPrefix: whatThatMeansPrefix,
  getHowToSay: getHowToSay,
  getMeaning: getMeaning,
  spanishToEnglish: spanishToEnglish,
  englishToSpanish: englishToSpanish
};