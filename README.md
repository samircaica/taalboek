# LinguaLibros — Android MVP 0.1

Aplicación nativa de aprendizaje de idiomas mediante libros, frases coloquiales y gramática interactiva, construida con **Kotlin y Jetpack Compose**.

## Abrir en Android Studio
1. Abrir el repositorio en Android Studio.
2. Usar JDK 17 y Android SDK 35; sincronizar dependencias con Gradle.
3. Ejecutar el módulo `app` en Android 8.0 o superior.

Este repositorio incluye scripts Gradle, pero no incluye `gradle-wrapper.jar`. Si es necesario, generar el wrapper con una instalación local de Gradle compatible (`gradle wrapper --gradle-version 8.11.1`).

## MVP
- Biblioteca de muestras filtrada por idioma y categoría.
- Importación local de textos TXT.
- Lector con selección de palabras y pronunciación TTS del dispositivo.
- Reproducción de audio local con Media3 y saltos de ±30 s.
- Frases coloquiales, gramática y ejercicios interactivos.
- Preferencias persistentes con DataStore.
- Inglés, español, alemán, neerlandés, francés y chino mandarín.

## Pendiente
- Descarga automática de EPUB, portadas, catálogo remoto y verificación de licencias.
- Backend de IA para traducción contextual y generación de audio con voz seleccionada.
- Alineación temporal palabra por palabra entre EPUB y audiolibro.
- Persistencia del progreso de aprendizaje.

Las frases y fragmentos literarios incluidos son **muestras**. Hay que comprobar los derechos de cada edición o traducción antes de distribuir obras completas.

**Estado:** proyecto fuente inicial sin compilación de Android verificada en este entorno.

## Fase 1 — estabilización

Se mantiene una rama `feature/fase-1-estabilizacion` con pruebas unitarias de navegación, CI y correcciones iniciales. La compilación se ejecuta en GitHub Actions con Java 17, SDK 35 y Gradle 8.11.1.

Para compilar localmente desde la raíz (con Gradle 8.11.1 instalado):

```bash
gradle :app:assembleDebug :app:testDebugUnitTest
```

Para ejecutar en Android Studio, usar **Run → app**. La generación del audio IA, la sincronización temporal y el lector EPUB completo permanecen pendientes.
