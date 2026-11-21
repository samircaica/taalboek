# Taalboek Web — MVP 0.1

Aplicación web PWA con React + Vite, diseñada para funcionar en navegadores de escritorio y móviles.

## Iniciar en desarrollo
Requiere Node.js moderno (20.19+ o 22.12+ recomendado para Vite 6) y npm.

```bash
cd web
npm install
npm run dev
```

Abrir la dirección local mostrada por Vite (normalmente http://localhost:5173).

## Construir y comprobar
```bash
npm test
npm run build
npm run preview
```

La PWA solo instala el service worker en compilaciones de producción (HTTPS o localhost). Para instalarla: menú del navegador → Instalar aplicación / Añadir a pantalla de inicio, según plataforma.

## Incluido
- Biblioteca de fragmentos de muestra con filtros, búsqueda y portadas visuales de demostración.
- Importación de archivos TXT (UTF-8) y almacenamiento en IndexedDB.
- Lector con selección de palabras, lectura TTS del navegador y controles de navegación por palabra.
- Selección del idioma propio y de lectura: inglés, español, alemán, neerlandés, francés y chino mandarín.
- Preferencias de velocidad, tono y selección de voz *realmente disponible* en el navegador.
- Importación de archivos de audio locales para reproducir, pausar y saltar 30 segundos.
- Frases coloquiales, ejemplos de gramática y comprobación de ejercicios.
- Guardado de lecciones completadas en el navegador.

## Límites actuales
- Los libros del catálogo son **extractos**: no hay todavía descarga de libros EPUB completos.
- Las traducciones de ejemplo están en español. Un idioma nativo distinto requiere el servicio de traducción.
- Las preferencias de género de voz no garantizan una voz de hombre o mujer: dependen del motor del navegador. La voz neuronal personalizada necesitará un backend TTS.
- El audio del sistema (`speechSynthesis`) **no se guarda como archivo descargable**; se sintetiza en el dispositivo si hay una voz local disponible, pero algunos motores requieren red.
- La importación de audio es local y manual, no hay aún alineación palabra por palabra ni generación automática de audiolibros.
- El almacenamiento IndexedDB puede ser borrado por el navegador o restringido por políticas del dispositivo. No garantizar disponibilidad offline en cualquier navegador.
- El servicio de IA, catálogo de obras verificadas y descarga offline de paquetes audio/texto son posteriores.

No almacenar claves de API de terceros en el frontend. Utilizar un backend para voz y traducción.
