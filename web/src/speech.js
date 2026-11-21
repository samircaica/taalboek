import { LANGUAGES } from './catalog.js';
export function getLocale(preferences) {
  const selected=LANGUAGES.find(l=>l.code===preferences.readingLanguage);
  return preferences.accent || selected?.locale || 'en-GB';
}
export function availableVoices(locale) {
  if(!('speechSynthesis' in window)) return [];
  const voices=window.speechSynthesis.getVoices();
  const preferred=voices.filter(v=>v.lang.toLowerCase().startsWith(locale.slice(0,2).toLowerCase()));
  return preferred.length?preferred:voices;
}
export function speak(text,preferences,voiceURI) {
  if(!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang=getLocale(preferences);
  utterance.pitch=Number(preferences.pitch)||1;
  utterance.rate=Number(preferences.speed)||1;
  const voice=window.speechSynthesis.getVoices().find(v=>v.voiceURI===voiceURI);
  if(voice) utterance.voice=voice;
  window.speechSynthesis.speak(utterance);
  return true;
}
export function stopSpeech(){if('speechSynthesis' in window)window.speechSynthesis.cancel();}
