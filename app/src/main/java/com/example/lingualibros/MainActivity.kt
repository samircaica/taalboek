package com.example.lingualibros

import android.net.Uri
import android.os.Bundle
import android.speech.tts.TextToSpeech
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import kotlinx.coroutines.launch
import java.util.Locale

private val Indigo = Color(0xFF344C88)
private val Pale = Color(0xFFF1F4FA)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val repository = PreferencesRepository(applicationContext)
        setContent {
            MaterialTheme(colorScheme = lightColorScheme(primary = Indigo)) {
                LinguaLibrosApp(repository)
            }
        }
    }
}

@Composable
private fun LinguaLibrosApp(repo: PreferencesRepository) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val preferences by repo.preferences.collectAsStateWithLifecycle(initialValue = LearningPreferences())
    val scope = rememberCoroutineScope()
    val speech = remember { SpeechService(context) }
    val player = remember { ExoPlayer.Builder(context).build() }
    var tab by remember { mutableIntStateOf(0) }
    var activeBook by remember { mutableStateOf<Book?>(null) }
    DisposableEffect(Unit) { onDispose { speech.close(); player.release() } }
    val textPicker = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) {
            val text = runCatching {
                context.contentResolver.openInputStream(uri)?.bufferedReader()?.use {
                    it.readText().take(200_000)
                }
            }.getOrNull()
            if (!text.isNullOrBlank()) {
                activeBook = Book("Documento local", "Importación TXT", "Personal", preferences.readingLanguage, text)
            }
        }
    }
    val audioPicker = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri: Uri? ->
        if (uri != null) {
            player.setMediaItem(MediaItem.fromUri(uri))
            player.prepare()
            player.play()
        }
    }
    Scaffold(
        topBar = {
            Surface(shadowElevation = 2.dp) {
                Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    if (activeBook != null) IconButton(onClick = { activeBook = null; speech.stop() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                    Text(if (activeBook == null) "LinguaLibros" else "Lector", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.weight(1f))
                    Text(languages.firstOrNull { it.code == preferences.readingLanguage }?.label.orEmpty())
                }
            }
        },
        bottomBar = {
            if (activeBook == null) NavigationBar {
                val titles = listOf("Biblioteca", "Frases", "Gramática", "Ajustes")
                val icons = listOf(Icons.Default.MenuBook, Icons.Default.ChatBubble, Icons.Default.School, Icons.Default.Settings)
                titles.forEachIndexed { index, title ->
                    NavigationBarItem(selected = tab == index, onClick = { tab = index },
                        icon = { Icon(icons[index], contentDescription = title) }, label = { Text(title) })
                }
            }
        }
    ) { inset ->
        Box(Modifier.fillMaxSize().padding(inset)) {
            val book = activeBook
            when {
                book != null -> ReaderScreen(book, preferences, speech, player) { audioPicker.launch(arrayOf("audio/*")) }
                tab == 0 -> LibraryScreen(preferences, onOpen = { activeBook = it }, onImport = { textPicker.launch(arrayOf("text/plain")) })
                tab == 1 -> PhraseScreen(preferences, speech)
                tab == 2 -> GrammarScreen(preferences, speech)
                else -> SettingsScreen(preferences,
                    onSave = { scope.launch { repo.save(it) } },
                    onPreview = { text, selection -> speech.speak(text, selection) })
            }
        }
    }
}

@Composable
private fun LibraryScreen(preferences: LearningPreferences, onOpen: (Book) -> Unit, onImport: () -> Unit) {
    var query by remember { mutableStateOf("") }
    var category by remember(preferences.readingLanguage) { mutableStateOf("Todas") }
    val available = books.filter { it.language == preferences.readingLanguage }
    val filtered = available.filter { (category == "Todas" || it.category == category) && it.title.contains(query, ignoreCase = true) }
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text("Biblioteca", style = MaterialTheme.typography.headlineSmall)
        OutlinedTextField(query, onValueChange = { query = it }, label = { Text("Buscar libro") }, modifier = Modifier.fillMaxWidth())
        Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            (listOf("Todas") + available.map { it.category }.distinct()).forEach {
                FilterChip(selected = category == it, onClick = { category = it }, label = { Text(it) })
            }
        }
        OutlinedButton(onClick = onImport, modifier = Modifier.fillMaxWidth()) { Text("Importar TXT local") }
        Text("Fragmentos ilustrativos. Verificar derechos por obra y edición.", color = Color.Gray, style = MaterialTheme.typography.bodySmall)
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(filtered) { book ->
                Card(onClick = { onOpen(book) }) {
                    Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                        Surface(color = Pale, shape = RoundedCornerShape(8.dp), modifier = Modifier.size(68.dp, 92.dp)) {
                            Box(contentAlignment = Alignment.Center) { Icon(Icons.Default.AutoStories, null, tint = Indigo) }
                        }
                        Spacer(Modifier.width(12.dp))
                        Column {
                            Text(book.title, fontWeight = FontWeight.Bold)
                            Text(book.author)
                            Text(book.category, color = Indigo, style = MaterialTheme.typography.labelMedium)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ReaderScreen(book: Book, p: LearningPreferences, speech: SpeechService, player: ExoPlayer, onAudio: () -> Unit) {
    val words = remember(book) { ReaderNavigation.tokenize(book.excerpt) }
    var selected by remember(book) { mutableIntStateOf(0) }
    var translationOpen by remember { mutableStateOf(false) }
    var playing by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(book.title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text(book.author, color = Color.Gray)
        Text("Pulsa una palabra para seleccionarla", style = MaterialTheme.typography.bodySmall)
        words.chunked(4).forEachIndexed { group, tokens ->
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                tokens.forEachIndexed { i, token ->
                    val pos = group * 4 + i
                    Surface(onClick = { selected = pos; translationOpen = true }, color = if (selected == pos) Pale else Color.Transparent) {
                        Text(token, Modifier.padding(4.dp))
                    }
                }
            }
        }
        Card(colors = CardDefaults.cardColors(containerColor = Pale)) {
            Column(Modifier.padding(12.dp)) {
                Text("Palabra: " + words.getOrNull(selected).orEmpty(), fontWeight = FontWeight.Bold)
                if (translationOpen) Text("Traducción contextual: requiere backend de IA")
                Button(onClick = { speech.speak(words.getOrNull(selected).orEmpty(), p) }) { Text("Pronunciar palabra") }
            }
        }
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            IconButton(onClick = {
                selected = ReaderNavigation.previous(selected, words.size)
                words.getOrNull(selected)?.let { speech.speak(it, p) }
            }) { Icon(Icons.Default.SkipPrevious, "Palabra anterior") }
            Button(onClick = { speech.speak(book.excerpt, p) }) { Text("Leer con TTS") }
            IconButton(onClick = {
                selected = ReaderNavigation.next(selected, words.size)
                words.getOrNull(selected)?.let { speech.speak(it, p) }
            }) { Icon(Icons.Default.SkipNext, "Palabra siguiente") }
        }
        OutlinedButton(onClick = { speech.stop() }) { Text("Detener TTS") }
        HorizontalDivider()
        Text("Audio descargado o importado", fontWeight = FontWeight.Bold)
        OutlinedButton(onClick = onAudio) { Text("Elegir audio del dispositivo") }
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            OutlinedButton(onClick = { player.seekTo(ReaderNavigation.seekBack(player.currentPosition)) }) { Text("−30 s") }
            IconButton(onClick = {
                if (player.isPlaying) player.pause() else player.play()
                playing = player.isPlaying
            }) { Icon(if (playing) Icons.Default.Pause else Icons.Default.PlayArrow, "Play / Pause") }
            OutlinedButton(onClick = {
                val max = if (player.duration > 0) player.duration else Long.MAX_VALUE
                player.seekTo(ReaderNavigation.seekForward(player.currentPosition, max))
            }) { Text("+30 s") }
        }
        HorizontalDivider()
        Text("Seleccionar y copiar texto")
        SelectionContainer { Text(book.excerpt) }
        Text("La sincronización exacta palabra/audio y la traducción se incorporarán con el servicio IA.", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
    }
}

@Composable
private fun PhraseScreen(p: LearningPreferences, speech: SpeechService) {
    val available = phrases.filter { it.language == p.readingLanguage }
    var category by remember(p.readingLanguage) { mutableStateOf("Todas") }
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Frases coloquiales", style = MaterialTheme.typography.headlineSmall)
        Row(Modifier.horizontalScroll(rememberScrollState())) {
            (listOf("Todas") + available.map { it.category }.distinct()).forEach { cat ->
                FilterChip(selected = category == cat, onClick = { category = cat }, label = { Text(cat) }, modifier = Modifier.padding(end = 6.dp))
            }
        }
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(available.filter { category == "Todas" || it.category == category }) { phrase ->
                Card {
                    Column(Modifier.fillMaxWidth().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(phrase.category, color = Indigo, style = MaterialTheme.typography.labelSmall)
                        Text(phrase.source, style = MaterialTheme.typography.titleLarge)
                        Text(if (p.nativeLanguage == "es") phrase.spanish else "Traducción a idioma nativo: pendiente")
                        Text(phrase.explanation)
                        Button(onClick = { speech.speak(phrase.source, p) }) { Text("Escuchar frase") }
                    }
                }
            }
        }
    }
}

@Composable
private fun GrammarScreen(p: LearningPreferences, speech: SpeechService) {
    val available = lessons.filter { it.language == p.readingLanguage }
    var index by remember(p.readingLanguage) { mutableIntStateOf(0) }
    var answer by remember(p.readingLanguage, index) { mutableIntStateOf(-1) }
    var checked by remember(p.readingLanguage, index) { mutableStateOf(false) }
    val lesson = available.getOrNull(index)
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Gramática interactiva", style = MaterialTheme.typography.headlineSmall)
        if (lesson == null) { Text("No hay lecciones disponibles"); return@Column }
        Text("Lección ${index + 1} / ${available.size}", color = Indigo)
        Text(lesson.title, style = MaterialTheme.typography.titleLarge)
        Card(colors = CardDefaults.cardColors(containerColor = Pale)) { Text(lesson.rule, Modifier.padding(16.dp)) }
        Text(lesson.example, style = MaterialTheme.typography.titleMedium)
        Button(onClick = { speech.speak(lesson.example, p) }) { Text("Pronunciar ejemplo") }
        HorizontalDivider()
        Text(lesson.question)
        lesson.options.forEachIndexed { i, option ->
            Row(Modifier.fillMaxWidth().clickable { answer = i; checked = false }, verticalAlignment = Alignment.CenterVertically) {
                RadioButton(selected = answer == i, onClick = { answer = i; checked = false })
                Text(option)
            }
        }
        Button(onClick = { checked = true }, enabled = answer >= 0) { Text("Comprobar") }
        if (checked) {
            Text(if (answer == lesson.correct) "Correcto" else "Revisa tu respuesta")
            Text(lesson.feedback)
            OutlinedButton(onClick = { speech.speak(lesson.example, p) }) { Text("Escuchar forma correcta") }
        }
        Button(onClick = { index = (index + 1) % available.size }, modifier = Modifier.fillMaxWidth()) { Text("Siguiente lección") }
    }
}

@Composable
private fun SettingsScreen(current: LearningPreferences, onSave: (LearningPreferences) -> Unit, onPreview: (String, LearningPreferences) -> Unit) {
    var draft by remember(current) { mutableStateOf(current) }
    var nativeMenu by remember { mutableStateOf(false) }
    var readingMenu by remember { mutableStateOf(false) }
    var saved by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Preferencias", style = MaterialTheme.typography.headlineSmall)
        Text("Mi idioma", fontWeight = FontWeight.Bold)
        Box {
            OutlinedButton(onClick = { nativeMenu = true }, modifier = Modifier.fillMaxWidth()) {
                Text(languages.firstOrNull { it.code == draft.nativeLanguage }?.label.orEmpty())
            }
            DropdownMenu(expanded = nativeMenu, onDismissRequest = { nativeMenu = false }) {
                languages.forEach { lang ->
                    DropdownMenuItem(text = { Text(lang.label) }, onClick = {
                        draft = draft.copy(nativeLanguage = lang.code); nativeMenu = false; saved = false
                    })
                }
            }
        }
        Text("Idioma de lectura", fontWeight = FontWeight.Bold)
        Box {
            OutlinedButton(onClick = { readingMenu = true }, modifier = Modifier.fillMaxWidth()) {
                Text(languages.firstOrNull { it.code == draft.readingLanguage }?.label.orEmpty())
            }
            DropdownMenu(expanded = readingMenu, onDismissRequest = { readingMenu = false }) {
                languages.forEach { lang ->
                    DropdownMenuItem(text = { Text(lang.label) }, onClick = {
                        draft = draft.copy(readingLanguage = lang.code, accent = lang.locale); readingMenu = false; saved = false
                    })
                }
            }
        }
        HorizontalDivider()
        Text("Tipo de voz (preferencia para futura narración neuronal)")
        Row {
            FilterChip(selected = draft.gender == "female", onClick = { draft = draft.copy(gender = "female") }, label = { Text("Mujer") })
            Spacer(Modifier.width(8.dp))
            FilterChip(selected = draft.gender == "male", onClick = { draft = draft.copy(gender = "male") }, label = { Text("Hombre") })
        }
        Text("Tono: ${"%.2f".format(Locale.US, draft.pitch)}")
        Slider(value = draft.pitch, onValueChange = { draft = draft.copy(pitch = it) }, valueRange = 0.7f..1.3f)
        Text("Velocidad: ${"%.2f".format(Locale.US, draft.speed)}×")
        Slider(value = draft.speed, onValueChange = { draft = draft.copy(speed = it) }, valueRange = 0.75f..1.5f)
        Text("Acento actual: ${draft.accent}")
        Text("La elección de voz hombre/mujer se aplicará al backend de IA. El TTS local depende de las voces disponibles en Android.", color = Color.Gray, style = MaterialTheme.typography.bodySmall)
        OutlinedButton(onClick = { onPreview(when (draft.readingLanguage) {
            "es" -> "Hola, bienvenido a LinguaLibros."
            "de" -> "Hallo, willkommen bei LinguaLibros."
            "nl" -> "Hallo, welkom bij LinguaLibros."
            "fr" -> "Bonjour, bienvenue sur LinguaLibros."
            "zh" -> "你好，欢迎使用 LinguaLibros。"
            else -> "Hello! Welcome to LinguaLibros."
        }, draft) }) { Text("Probar voz") }
        Button(onClick = { onSave(draft); saved = true }, modifier = Modifier.fillMaxWidth()) { Text("Guardar preferencias") }
        if (saved) Text("Preferencias enviadas para guardar")
    }
}

private class SpeechService(context: android.content.Context) : TextToSpeech.OnInitListener {
    private val tts = TextToSpeech(context.applicationContext, this)
    private var ready = false
    override fun onInit(status: Int) { ready = status == TextToSpeech.SUCCESS }
    fun speak(text: String, p: LearningPreferences) {
        if (!ready || text.isBlank()) return
        tts.language = Locale.forLanguageTag(p.accent)
        tts.setPitch(p.pitch)
        tts.setSpeechRate(p.speed)
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "speech-${System.nanoTime()}")
    }
    fun stop() { tts.stop() }
    fun close() { tts.stop(); tts.shutdown() }
}
