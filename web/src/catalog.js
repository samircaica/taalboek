export const LANGUAGES = [
  { code:'en', name:'Inglés', flag:'🇬🇧', locale:'en-GB' },
  { code:'es', name:'Español', flag:'🇪🇸', locale:'es-ES' },
  { code:'de', name:'Alemán', flag:'🇩🇪', locale:'de-DE' },
  { code:'nl', name:'Holandés', flag:'🇳🇱', locale:'nl-NL' },
  { code:'fr', name:'Francés', flag:'🇫🇷', locale:'fr-FR' },
  { code:'zh', name:'Chino mandarín', flag:'🇨🇳', locale:'zh-CN' }
];
export const SAMPLES = [
  {id:'alice', title:"Alice's Adventures in Wonderland",author:'Lewis Carroll',category:'Fantasía',language:'en',level:'A2–B1', color:'#d3e8e7', mark:'♧', text:"Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do. Once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it."},
  {id:'sherlock',title:'The Adventures of Sherlock Holmes',author:'Arthur Conan Doyle',category:'Misterio',language:'en',level:'B1–B2',color:'#dce1ed',mark:'⌕',text:'To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name.'},
  {id:'quijote',title:'Don Quijote de la Mancha',author:'Miguel de Cervantes',category:'Clásicos',language:'es',level:'B2',color:'#efe0c8',mark:'✺',text:'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo.'},
  {id:'verwandlung',title:'Die Verwandlung',author:'Franz Kafka',category:'Clásicos',language:'de',level:'B2',color:'#e1d6cd',mark:'✦',text:'Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheuren Ungeziefer verwandelt.'},
  {id:'havelaar',title:'Max Havelaar',author:'Multatuli',category:'Clásicos',language:'nl',level:'B2',color:'#e3dfcc',mark:'❧',text:'Ik ben makelaar in koffie, en woon op de Lauriergracht, No. 37.'},
  {id:'candide',title:'Candide',author:'Voltaire',category:'Clásicos',language:'fr',level:'B1–B2',color:'#e4dfef',mark:'✽',text:'Il y avait en Westphalie, dans le château de monsieur le baron, un jeune garçon à qui la nature avait donné les mœurs les plus douces.'},
  {id:'sanzijing',title:'三字经',author:'Tradicional',category:'Educación',language:'zh',level:'A2',color:'#efdad6',mark:'文',text:'人之初，性本善。性相近，习相远。'}
];
// Fragmentos de demostración, no obras completas ni catálogo de derechos verificados.
export const PHRASES=[
 {id:'p1',language:'en',category:'Saludos',source:"What's up?",translation:'¿Qué tal?',explanation:'Saludo informal entre conocidos; normalmente no es una pregunta literal.'},
 {id:'p2',language:'en',category:'Compras',source:"I'm just looking, thanks.",translation:'Solo estoy mirando, gracias.',explanation:'Respuesta cortés a una oferta de ayuda en una tienda.'},
 {id:'p3',language:'en',category:'Ayuda',source:'Could you give me a hand?',translation:'¿Me podrías echar una mano?',explanation:'Could introduce una petición cortés; give me a hand es una expresión idiomática.'},
 {id:'p4',language:'es',category:'Saludos',source:'¿Qué tal?',translation:"How's it going?",explanation:'Saludo informal cotidiano.'},
 {id:'p5',language:'de',category:'Saludos',source:"Wie geht's?",translation:'¿Cómo estás?',explanation:'Contracción coloquial de Wie geht es?'},
 {id:'p6',language:'nl',category:'Saludos',source:'Hoe gaat het?',translation:'¿Cómo estás?',explanation:'Pregunta cotidiana para interesarse por otra persona.'},
 {id:'p7',language:'fr',category:'Saludos',source:'Ça va ?',translation:'¿Qué tal?',explanation:'Saludo informal que también sirve para preguntar si alguien está bien.'},
 {id:'p8',language:'zh',category:'Saludos',source:'你好吗？',translation:'¿Cómo estás?',explanation:'Pregunta sencilla de nivel inicial; nǐ hǎo ma.'}
];
export const GRAMMAR=[
 {id:'g1',language:'en',title:'Presente simple',rule:'Para hábitos y hechos generales. Con he/she/it, el verbo normalmente añade -s.',example:'She works every day.',question:'She ___ English every day.',options:['study','studies','studying'],correct:1,explanation:'She es tercera persona singular; study cambia a studies.'},
 {id:'g2',language:'en',title:'Pasado simple',rule:'Se utiliza para acciones completadas. Los verbos regulares suelen añadir -ed.',example:'They visited London yesterday.',question:'They ___ London yesterday.',options:['visit','visited','visiting'],correct:1,explanation:'Yesterday sitúa la acción en el pasado: visited.'},
 {id:'g3',language:'es',title:'Ser y estar',rule:'Ser expresa identidad o características; estar expresa estados y ubicaciones.',example:'Estoy en casa.',question:'Yo ___ en casa.',options:['soy','estoy','ser'],correct:1,explanation:'Para indicar ubicación se usa estar: estoy.'},
 {id:'g4',language:'de',title:'Artículos',rule:'Der, die y das varían según el género y el caso.',example:'Das Buch ist neu.',question:'___ Buch ist neu.',options:['Der','Die','Das'],correct:2,explanation:'Buch es neutro; en nominativo singular se usa das.'},
 {id:'g5',language:'nl',title:'Orden verbal',rule:'En una oración principal afirmativa, el verbo conjugado suele ocupar la segunda posición.',example:'Vandaag lees ik een boek.',question:'Vandaag ___ ik een boek.',options:['lees','leest','lezen'],correct:0,explanation:'Con ik se usa lees.'},
 {id:'g6',language:'fr',title:'Artículos',rule:'Le y la son artículos definidos de masculino y femenino singular.',example:'La maison est grande.',question:'___ maison est grande.',options:['Le','La','Les'],correct:1,explanation:'Maison es femenino singular: la.'},
 {id:'g7',language:'zh',title:'Preguntas con 吗',rule:'La partícula 吗 (ma) al final forma una pregunta de sí o no.',example:'你好吗？',question:'你___吗？ (¿Estás bien?)',options:['好','是','有'],correct:0,explanation:'La expresión 你好吗？ se construye con 好 (hǎo).'}
];
