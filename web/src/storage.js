const DB_NAME='taalboek-web-v1';
const STORE='downloads';
const VERSION=1;
export function openDb() {
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,VERSION);
    request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE))request.result.createObjectStore(STORE,{keyPath:'id'});};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}
export async function saveDownload(entry) {
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(STORE,'readwrite');
    transaction.objectStore(STORE).put(entry);
    transaction.oncomplete=()=>{db.close();resolve(entry);};
    transaction.onerror=()=>{db.close();reject(transaction.error);};
  });
}
export async function getDownload(id) {
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const request=db.transaction(STORE,'readonly').objectStore(STORE).get(id);
    request.onsuccess=()=>{db.close();resolve(request.result||null);};
    request.onerror=()=>{db.close();reject(request.error);};
  });
}
export async function listDownloads() {
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const request=db.transaction(STORE,'readonly').objectStore(STORE).getAll();
    request.onsuccess=()=>{db.close();resolve(request.result||[]);};
    request.onerror=()=>{db.close();reject(request.error);};
  });
}
export async function removeDownload(id) {
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(STORE,'readwrite');
    transaction.objectStore(STORE).delete(id);
    transaction.oncomplete=()=>{db.close();resolve();};
    transaction.onerror=()=>{db.close();reject(transaction.error);};
  });
}
const KEY='taalboek-preferences-v1';
export const defaultPreferences={nativeLanguage:'es',readingLanguage:'en',gender:'female',pitch:1,speed:1,accent:'en-GB'};
export function loadPreferences() {
  try {return {...defaultPreferences,...JSON.parse(localStorage.getItem(KEY)||'{}')};}
  catch {return {...defaultPreferences};}
}
export function savePreferences(value){localStorage.setItem(KEY,JSON.stringify(value));}
export function tokenize(text,language='en') {
  if (!text) return [];
  if(language==='zh' && typeof Intl.Segmenter==='function'){
    const segmenter=new Intl.Segmenter('zh',{granularity:'word'});
    return [...segmenter.segment(text)].filter(s=>s.isWordLike).map(s=>s.segment);
  }
  return text.match(/[^\s]+/gu)||[];
}
export function seekSeconds(time,delta,duration) {
  return Math.min(Math.max(0,time+delta),Number.isFinite(duration)?duration:Number.MAX_SAFE_INTEGER);
}
