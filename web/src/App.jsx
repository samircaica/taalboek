import React, {useEffect,useMemo,useRef,useState} from 'react';
import {
  BookOpen,BookMarked,GraduationCap,Languages,Settings,Search,Play,Pause,SkipBack,SkipForward,
  Volume2,Upload,Download,ChevronLeft,ChevronRight,CheckCircle,Info,Trash2,Headphones,
  Clock,Bookmark,Square,RotateCcw,RotateCw,MessageCircle,Mic2
} from 'lucide-react';
import {LANGUAGES,SAMPLES,PHRASES,GRAMMAR} from './catalog.js';
import {loadPreferences,savePreferences,listDownloads,saveDownload,removeDownload,tokenize,seekSeconds} from './storage.js';
import {speak,stopSpeech,availableVoices,getLocale} from './speech.js';

const nav=[
  {id:'library',label:'Biblioteca',icon:BookOpen},
  {id:'phrases',label:'Frases',icon:MessageCircle},
  {id:'grammar',label:'Gramática',icon:GraduationCap},
  {id:'progress',label:'Mi progreso',icon:BookMarked},
  {id:'settings',label:'Ajustes',icon:Settings}
];
const langName=code=>LANGUAGES.find(l=>l.code===code)?.name||code;
const cacheKey='taalboek-learning-progress-v1';
function getProgress(){try{return JSON.parse(localStorage.getItem(cacheKey)||'{}')}catch{return {}}}
function titleFor(item){return item.title||'Archivo importado'}

function Cover({book}){
  return <div className="cover" style={{'--cover':book.color||'#c8dde9'}}>
    <div className="cover-border"><span className="cover-mark">{book.mark||'✦'}</span><strong>{book.title}</strong><small>{book.author}</small></div>
  </div>;
}
function Pill({children}){return <span className="pill">{children}</span>}
function Empty({children}){return <div className="empty">{children}</div>}
function IconButton({icon:Icon,children,...props}){return <button className="icon-button" type="button" {...props}><Icon size={19}/>{children&&<span>{children}</span>}</button>}

export default function App(){
  const [tab,setTab]=useState('library');
  const [preferences,setPreferences]=useState(loadPreferences);
  const [downloads,setDownloads]=useState([]);
  const [selectedBook,setSelectedBook]=useState(null);
  const [toast,setToast]=useState('');
  const [progress,setProgress]=useState(getProgress);
  const [voices,setVoices]=useState([]);
  const audioRef=useRef(null);
  const audioURL=useRef(null);

  useEffect(()=>{
    listDownloads().then(setDownloads).catch(()=>notify('No se pudo abrir el almacenamiento local.'));
    if('speechSynthesis' in window){
      const update=()=>setVoices(availableVoices(getLocale(preferences)));
      update(); window.speechSynthesis.addEventListener?.('voiceschanged',update);
      return ()=>window.speechSynthesis.removeEventListener?.('voiceschanged',update);
    }
  },[preferences.readingLanguage,preferences.accent]);
  useEffect(()=>{
    savePreferences(preferences);
  },[preferences]);
  useEffect(()=>{localStorage.setItem(cacheKey,JSON.stringify(progress))},[progress]);
  useEffect(()=>()=>{stopSpeech();if(audioURL.current)URL.revokeObjectURL(audioURL.current)},[]);
  function notify(message){setToast(message);window.clearTimeout(notify.timeout);notify.timeout=window.setTimeout(()=>setToast(''),4500)}
  function patchPreferences(patch){setPreferences(p=>({...p,...patch}))}
  const allBooks=useMemo(()=>[...SAMPLES,...downloads.filter(x=>x.kind==='text').map(x=>x.book)], [downloads]);
  function openBook(book){setSelectedBook(book);setTab('reader');stopSpeech()}
  function goTo(next){setTab(next);if(next!=='reader'){stopSpeech();setSelectedBook(null)}}
  async function importText(file){
    if(!file)return;
    if(file.size>5*1024*1024){notify('Para esta versión, el TXT debe ocupar menos de 5 MB.');return;}
    const text=await file.text();
    if(!text.trim()){notify('El archivo TXT está vacío.');return;}
    const book={id:'local-'+crypto.randomUUID(),title:file.name.replace(/\.txt$/i,''),author:'Archivo personal',category:'Mis libros',
      language:preferences.readingLanguage,level:'',color:'#dfebf2',mark:'◈',text};
    const saved={id:'book:'+book.id,kind:'text',book};
    try{await saveDownload(saved);setDownloads(d=>[...d,saved]);openBook(book);notify('TXT guardado en este navegador.')}
    catch{notify('No se pudo guardar el libro en este navegador.')}
  }
  async function importAudio(file,book){
    if(!file)return;
    const entry={id:'audio:'+book.id,kind:'audio',bookId:book.id,name:file.name,blob:file};
    try{
      await saveDownload(entry);
      setDownloads(d=>[...d.filter(x=>x.id!==entry.id),entry]);
      notify('Audio guardado localmente para este libro.');
    }catch{notify('No se pudo guardar el audio; comprueba el espacio disponible.')}
  }
  async function deleteBook(book){
    try{
      await removeDownload('book:'+book.id); await removeDownload('audio:'+book.id);
      setDownloads(d=>d.filter(x=>x.book?.id!==book.id&&x.bookId!==book.id));notify('Libro local eliminado.');
    }catch{notify('No se pudo eliminar el libro.')}
  }
  function narrate(text){if(!speak(text,preferences,preferences.voiceURI))notify('Este navegador no admite síntesis de voz.')}
  function markCompleted(key){
    setProgress(p=>({...p,[key]:true}));notify('Añadido a tu progreso.');
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><BookOpen size={24}/></div><div><strong>Taalboek</strong><small>Aprende leyendo</small></div></div>
      <nav aria-label="Navegación principal">{nav.map(({id,label,icon:Icon})=><button key={id} className={'nav-link '+(tab===id||(tab==='reader'&&id==='library')?'active':'')} onClick={()=>goTo(id)}><Icon size={20}/>{label}</button>)}</nav>
      <div className="sidebar-bottom"><Languages size={18}/><span>{langName(preferences.nativeLanguage)} → {langName(preferences.readingLanguage)}</span></div>
    </aside>
    <main className="main">
      <header className="topbar">
        <div className="topbar-context"><span className="eyebrow">APRENDE A TU RITMO</span><strong>{tab==='reader'?'Tu lectura':nav.find(n=>n.id===tab)?.label}</strong></div>
        <div className="topbar-right"><Pill>{LANGUAGES.find(l=>l.code===preferences.readingLanguage)?.flag} {langName(preferences.readingLanguage)}</Pill><button className="avatar" title="Abrir preferencias" onClick={()=>goTo('settings')}><Settings size={19}/></button></div>
      </header>
      <div className="page">
        {tab==='library'&&<Library books={allBooks} preferences={preferences} onOpen={openBook} onImport={importText} onDelete={deleteBook} downloads={downloads}/>}
        {tab==='reader'&&selectedBook&&<Reader key={selectedBook.id} book={selectedBook} preferences={preferences} narrate={narrate}
          onBack={()=>goTo('library')} onAudio={file=>importAudio(file,selectedBook)}
          audioEntry={downloads.find(d=>d.id==='audio:'+selectedBook.id)} audioRef={audioRef} audioURL={audioURL} notify={notify}/>}
        {tab==='phrases'&&<Phrases preferences={preferences} narrate={narrate} progress={progress} onComplete={markCompleted}/>}
        {tab==='grammar'&&<Grammar preferences={preferences} narrate={narrate} progress={progress} onComplete={markCompleted}/>}
        {tab==='progress'&&<Progress progress={progress} books={allBooks} onNavigate={goTo}/>}
        {tab==='settings'&&<Preferences value={preferences} update={patchPreferences} voices={voices} narrate={narrate}/>}
      </div>
    </main>
    <nav className="mobile-nav" aria-label="Navegación móvil">{nav.map(({id,label,icon:Icon})=><button key={id} className={(tab===id||(tab==='reader'&&id==='library'))?'active':''} onClick={()=>goTo(id)}><Icon size={21}/><span>{label}</span></button>)}</nav>
    {toast&&<div className="toast" role="status">{toast}</div>}
  </div>;
}

function Library({books,preferences,onOpen,onImport,onDelete,downloads}){
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('Todas');
  const input=useRef(null);
  const available=books.filter(b=>b.language===preferences.readingLanguage);
  const categories=['Todas',...new Set(available.map(b=>b.category))];
  const shown=available.filter(b=>(category==='Todas'||b.category===category)&&
    (b.title+' '+b.author).toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  useEffect(()=>setCategory('Todas'),[preferences.readingLanguage]);
  return <>
    <div className="hero">
      <div><span className="eyebrow gold">TU BIBLIOTECA PERSONAL</span><h1>Una historia.<br/><em>Mil palabras nuevas.</em></h1><p>Descubre libros y aprende escuchando el idioma original.</p><button className="button light" onClick={()=>input.current?.click()}><Upload size={18}/> Importar un libro TXT</button></div>
      <div className="hero-books" aria-hidden="true"><div>TAAL<br/>BOEK</div><div>READ<br/>LEARN</div><div>LANG<br/>UAGE</div></div>
    </div>
    <div className="section-head"><div><span className="eyebrow">EXPLORA</span><h2>Libros en {langName(preferences.readingLanguage)}</h2></div><span className="subdued">{shown.length} libros</span></div>
    <div className="toolbar"><label className="search"><Search size={18}/><input placeholder="Busca por título o autor…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
      <div className="chips">{categories.map(cat=><button key={cat} onClick={()=>setCategory(cat)} className={'chip '+(category===cat?'selected':'')}>{cat}</button>)}</div>
    </div>
    {shown.length?<div className="books-grid">{shown.map(b=><article key={b.id} className="book-card">
      <button className="cover-button" onClick={()=>onOpen(b)} aria-label={'Abrir '+b.title}><Cover book={b}/></button>
      <div className="book-details"><span className="eyebrow">{b.category} {b.level?' · '+b.level:''}</span><h3>{b.title}</h3><p>{b.author}</p>
        <div className="book-actions"><button className="text-button" onClick={()=>onOpen(b)}>Leer libro <ChevronRight size={16}/></button>{b.id.startsWith('local-')&&<button className="delete" onClick={()=>onDelete(b)} aria-label={'Eliminar '+b.title}><Trash2 size={16}/></button>}</div>
      </div></article>)}</div>:<Empty>No hay libros para este filtro. Cambia de categoría o importa un archivo TXT.</Empty>}
    <input ref={input} hidden type="file" accept=".txt,text/plain" onChange={e=>{onImport(e.target.files?.[0]);e.target.value=''}}/>
    <div className="info"><Info size={18}/>Los libros del catálogo son fragmentos ilustrativos. La descarga de EPUB completos y portadas verificadas se incorporará después.</div>
  </>;
}

function Reader({book,preferences,narrate,onBack,onAudio,audioEntry,audioRef,audioURL,notify}){
  const [selected,setSelected]=useState(0),[segment,setSegment]=useState(''),[playing,setPlaying]=useState(false);
  const [duration,setDuration]=useState(0),[position,setPosition]=useState(0);
  const filePicker=useRef(null);
  const words=useMemo(()=>tokenize(book.text,book.language),[book]);
  useEffect(()=>{stopSpeech();return()=>{stopSpeech();audioRef.current?.pause();if(audioURL.current){URL.revokeObjectURL(audioURL.current);audioURL.current=null}}},[book.id]);
  useEffect(()=>{
    audioRef.current?.pause();setPlaying(false);setPosition(0);setDuration(0);
    if(audioURL.current){URL.revokeObjectURL(audioURL.current);audioURL.current=null}
    if(audioEntry?.blob&&audioRef.current){audioURL.current=URL.createObjectURL(audioEntry.blob);audioRef.current.src=audioURL.current;audioRef.current.load()}
  },[audioEntry?.blob,book.id]);
  const selectedText=words[selected]||'';
  function prev(){setSelected(i=>Math.max(0,i-1))}
  function next(){setSelected(i=>Math.min(words.length-1,i+1))}
  function selection(){const s=window.getSelection()?.toString()?.trim();if(s)setSegment(s)}
  function timeJump(delta){const a=audioRef.current;if(a){a.currentTime=seekSeconds(a.currentTime,delta,a.duration);setPosition(a.currentTime)}}
  function toggle(){const a=audioRef.current;if(!a||!audioEntry){notify('Importa primero un audio para este libro.');return}
    if(a.paused){a.play().then(()=>setPlaying(true)).catch(()=>notify('No se pudo reproducir este audio.'))}else{a.pause();setPlaying(false)}}
  function format(sec){return new Date(Math.max(0,sec)*1000).toISOString().substring(14,19)}
  return <div className="reader-layout">
    <div className="reader-column">
      <button className="back-link" onClick={onBack}><ChevronLeft size={17}/> Volver a la biblioteca</button>
      <div className="reading-paper">
        <div className="reading-header"><span className="eyebrow">LECTOR INTERACTIVO · {langName(book.language)}</span><h1>{book.title}</h1><p>{book.author}</p></div>
        <p className="reading-tip">Pulsa una palabra o selecciona una frase para escucharla.</p>
        <div className={'reading-text '+(book.language==='zh'?'chinese':'')} onMouseUp={selection} onTouchEnd={selection}>
          {words.map((word,i)=><React.Fragment key={i}><button className={'word '+(selected===i?'word-selected':'')} onClick={()=>{setSelected(i);setSegment('')}} title="Seleccionar palabra">{word}</button>{book.language!=='zh'?' ':''}</React.Fragment>)}
        </div>
      </div>
    </div>
    <aside className="reader-panel">
      <div className="panel-card"><span className="eyebrow">PRONUNCIACIÓN</span><h3>{segment||selectedText||'Selecciona texto'}</h3>
        <p className="subdued">{segment?'Fragmento seleccionado':'Palabra seleccionada'}</p>
        <button className="button primary full" onClick={()=>narrate(segment||selectedText)}><Volume2 size={18}/> Escuchar selección</button>
        <div className="row-actions"><IconButton icon={SkipBack} onClick={prev} disabled={selected===0}>Anterior</IconButton><IconButton icon={SkipForward} onClick={next} disabled={selected>=words.length-1}>Siguiente</IconButton></div>
        <div className="info compact"><Languages size={17}/> La traducción contextual con IA se integrará en la siguiente fase.</div>
      </div>
      <div className="panel-card"><span className="eyebrow">NARRACIÓN</span><h3>Reproductor local</h3><p className="subdued">Importa un audio para escucharlo sin conexión.</p>
        <button className="button outline full" onClick={()=>filePicker.current?.click()}><Upload size={17}/>{audioEntry?'Cambiar audio':'Importar audio'}</button>
        <input hidden ref={filePicker} type="file" accept="audio/*" onChange={e=>{onAudio(e.target.files?.[0]);e.target.value=''}}/>
        <audio ref={audioRef} preload="auto" onTimeUpdate={e=>setPosition(e.currentTarget.currentTime)}
          onLoadedMetadata={e=>setDuration(e.currentTarget.duration||0)} onEnded={()=>setPlaying(false)}/>
        <div className="player"><input aria-label="Posición del audio" type="range" min="0" max={Number.isFinite(duration)&&duration>0?duration:1} step=".1" value={Math.min(position,duration||1)} onChange={e=>{if(audioRef.current)audioRef.current.currentTime=Number(e.target.value)}} disabled={!audioEntry}/>
          <div className="player-time"><span>{format(position)}</span><span>{format(duration)}</span></div>
          <div className="player-controls"><button onClick={()=>timeJump(-30)} aria-label="Retroceder 30 segundos" disabled={!audioEntry}><RotateCcw size={21}/><small>30</small></button>
            <button className="play" onClick={toggle} aria-label={playing?'Pausar':'Reproducir'}>{playing?<Pause size={23}/>:<Play size={23}/>}</button>
            <button onClick={()=>timeJump(30)} aria-label="Avanzar 30 segundos" disabled={!audioEntry}><RotateCw size={21}/><small>30</small></button></div>
        </div>
        <button className="text-button" onClick={()=>narrate(book.text)}><Headphones size={16}/> Leer texto con voz del navegador</button>
        <button className="text-button" onClick={stopSpeech}><Square size={15}/> Detener voz</button>
      </div>
    </aside>
  </div>;
}

function Phrases({preferences,narrate,progress,onComplete}){
  const [category,setCategory]=useState('Todas');
  const available=PHRASES.filter(p=>p.language===preferences.readingLanguage);
  const cats=['Todas',...new Set(available.map(p=>p.category))];
  useEffect(()=>setCategory('Todas'),[preferences.readingLanguage]);
  return <><div className="section-head"><div><span className="eyebrow">APRENDE COMO SE HABLA</span><h1>Frases coloquiales</h1><p className="subdued">Expresiones para conversaciones reales, con pronunciación y explicaciones.</p></div></div>
    <div className="chips with-space">{cats.map(cat=><button key={cat} className={'chip '+(category===cat?'selected':'')} onClick={()=>setCategory(cat)}>{cat}</button>)}</div>
    <div className="lesson-grid">{available.filter(p=>category==='Todas'||category===p.category).map(p=><article className="lesson-card" key={p.id}>
      <div className="lesson-top"><Pill>{p.category}</Pill>{progress['phrase:'+p.id]&&<CheckCircle size={20} className="good"/>}</div><h2>{p.source}</h2>
      <p className="translation">{preferences.nativeLanguage==='es'?p.translation:'Traducción al idioma elegido: pendiente de IA'}</p><p>{p.explanation}</p>
      <div className="lesson-actions"><button className="button outline" onClick={()=>narrate(p.source)}><Volume2 size={17}/> Escuchar</button>
      <button className="button primary" onClick={()=>onComplete('phrase:'+p.id)}><Bookmark size={16}/> Aprendida</button></div>
    </article>)}</div></>;
}

function Grammar({preferences,narrate,progress,onComplete}){
  const available=GRAMMAR.filter(g=>g.language===preferences.readingLanguage);
  const [index,setIndex]=useState(0),[answer,setAnswer]=useState(null),[submitted,setSubmitted]=useState(false);
  useEffect(()=>{setIndex(0);setAnswer(null);setSubmitted(false)},[preferences.readingLanguage]);
  const lesson=available[index];
  if(!lesson)return <Empty>No hay lecciones todavía para este idioma.</Empty>;
  const correct=answer===lesson.correct;
  function next(){setIndex(i=>(i+1)%available.length);setAnswer(null);setSubmitted(false)}
  return <div className="grammar-wrapper"><div className="section-head"><div><span className="eyebrow">TU PROFESOR INTERACTIVO</span><h1>Gramática paso a paso</h1><p className="subdued">Comprende la regla, escucha el ejemplo y ponla en práctica.</p></div></div>
    <div className="grammar-card"><div className="lesson-top"><Pill>Lección {index+1} de {available.length}</Pill>{progress['grammar:'+lesson.id]&&<CheckCircle className="good"/>}</div>
      <h2>{lesson.title}</h2><div className="rule"><strong>La regla</strong><p>{lesson.rule}</p></div>
      <span className="eyebrow">ESCUCHA EL EJEMPLO</span><div className="grammar-example"><span>{lesson.example}</span><button className="round-button" onClick={()=>narrate(lesson.example)} aria-label="Escuchar ejemplo"><Volume2 size={19}/></button></div>
      <hr/><span className="eyebrow">PRACTICA</span><h3>{lesson.question}</h3>
      <div className="answer-list">{lesson.options.map((opt,i)=><button key={i} className={'answer '+(answer===i?'chosen':'')+(submitted&&i===lesson.correct?' right':'')+(submitted&&answer===i&&!correct?' wrong':'')} disabled={submitted}
        onClick={()=>setAnswer(i)}><span className="answer-letter">{String.fromCharCode(65+i)}</span>{opt}</button>)}</div>
      {submitted&&<div className={'feedback '+(correct?'success':'attention')}><strong>{correct?'¡Correcto!':'Vamos a corregirlo'}</strong><p>{lesson.explanation}</p></div>}
      <div className="lesson-footer"><button className="button outline" onClick={()=>narrate(lesson.example)}><Volume2 size={17}/> Pronunciar</button>
        {!submitted?<button className="button primary" disabled={answer===null} onClick={()=>{setSubmitted(true);if(correct)onComplete('grammar:'+lesson.id)}}>Comprobar</button>
          :<button className="button primary" onClick={next}>Siguiente <ChevronRight size={17}/></button>}</div>
    </div>
  </div>;
}

function Progress({progress,books,onNavigate}){
  const learned=Object.keys(progress).filter(x=>x.startsWith('phrase:')&&progress[x]).length;
  const rules=Object.keys(progress).filter(x=>x.startsWith('grammar:')&&progress[x]).length;
  return <><div className="section-head"><div><span className="eyebrow">TU CAMINO</span><h1>Mi progreso</h1><p className="subdued">Tus logros se guardan en este navegador.</p></div></div>
    <div className="stat-grid"><div className="stat"><BookMarked/><strong>{learned}</strong><span>Frases aprendidas</span></div><div className="stat"><GraduationCap/><strong>{rules}</strong><span>Reglas practicadas correctamente</span></div><div className="stat"><BookOpen/><strong>{books.length}</strong><span>Libros disponibles en biblioteca</span></div></div>
    <div className="info"><Info size={19}/> Los resultados se almacenan localmente. En una próxima fase incorporaremos cuentas, progreso de lectura, repaso espaciado y sincronización.</div>
    <button className="button primary" onClick={()=>onNavigate('grammar')}><GraduationCap size={18}/> Seguir aprendiendo</button></>;
}

function Preferences({value,update,voices,narrate}){
  const languageOptions=LANGUAGES.map(l=><option value={l.code} key={l.code}>{l.flag} {l.name}</option>);
  return <><div className="section-head"><div><span className="eyebrow">PERSONALIZA TU EXPERIENCIA</span><h1>Preferencias</h1><p className="subdued">Configura los idiomas y cómo quieres escuchar los textos.</p></div></div>
    <div className="settings-grid">
      <section className="settings-card"><div className="settings-heading"><Languages/><div><h2>Idiomas</h2><p>Elige tu idioma y el idioma de lectura.</p></div></div>
        <label className="field">Mi idioma <select value={value.nativeLanguage} onChange={e=>update({nativeLanguage:e.target.value})}>{languageOptions}</select></label>
        <label className="field">Idioma que quiero aprender <select value={value.readingLanguage} onChange={e=>{
          const lang=LANGUAGES.find(l=>l.code===e.target.value);update({readingLanguage:e.target.value,accent:lang?.locale,voiceURI:''});
        }}>{languageOptions}</select></label>
        <div className="info compact"><Info size={17}/> Los textos se narran en {langName(value.readingLanguage)}. La traducción contextual al idioma nativo requiere la futura integración con IA.</div>
      </section>
      <section className="settings-card"><div className="settings-heading"><Mic2/><div><h2>Narrador</h2><p>Usa las voces instaladas en tu navegador.</p></div></div>
        <label className="field">Preferencia de voz<select value={value.gender} onChange={e=>update({gender:e.target.value})}><option value="female">Mujer</option><option value="male">Hombre</option></select></label>
        <label className="field">Voz disponible<select value={value.voiceURI||''} onChange={e=>update({voiceURI:e.target.value})}><option value="">Voz predeterminada del navegador</option>{voices.map(v=><option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}</select></label>
        <label className="field">Tono <strong>{Number(value.pitch).toFixed(2)}</strong><input type="range" min=".7" max="1.3" step=".05" value={value.pitch} onChange={e=>update({pitch:Number(e.target.value)})}/></label>
        <label className="field">Velocidad <strong>{Number(value.speed).toFixed(2)}×</strong><input type="range" min=".75" max="1.5" step=".05" value={value.speed} onChange={e=>update({speed:Number(e.target.value)})}/></label>
        <button className="button primary full" onClick={()=>narrate(({en:'Hello, welcome to Taalboek!',es:'Hola, bienvenido a Taalboek.',de:'Hallo, willkommen bei Taalboek.',nl:'Hallo, welkom bij Taalboek.',fr:'Bonjour, bienvenue sur Taalboek.',zh:'你好，欢迎使用 Taalboek。'})[value.readingLanguage])}><Volume2 size={17}/> Escuchar muestra</button>
        <div className="info compact"><Info size={17}/> El género elegido no cambia automáticamente la voz del navegador; selecciona una voz concreta si está disponible. La voz IA personalizada se implementará después.</div>
      </section>
    </div>
  </>;
}
