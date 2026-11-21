package com.example.lingualibros

data class LanguageOption(val code: String, val label: String, val locale: String)
val languages = listOf(
    LanguageOption("en", "Inglés", "en-GB"),
    LanguageOption("es", "Español", "es-ES"),
    LanguageOption("de", "Alemán", "de-DE"),
    LanguageOption("nl", "Holandés", "nl-NL"),
    LanguageOption("fr", "Francés", "fr-FR"),
    LanguageOption("zh", "Chino mandarín", "zh-CN")
)

data class Book(val title: String, val author: String, val category: String, val language: String, val excerpt: String)
val books = listOf(
    Book("Alice's Adventures in Wonderland", "Lewis Carroll", "Fantasía", "en", "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do."),
    Book("The Adventures of Sherlock Holmes", "Arthur Conan Doyle", "Misterio", "en", "To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name."),
    Book("Pride and Prejudice", "Jane Austen", "Clásicos", "en", "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."),
    Book("Don Quijote de la Mancha", "Miguel de Cervantes", "Clásicos", "es", "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo."),
    Book("Die Verwandlung", "Franz Kafka", "Clásicos", "de", "Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheuren Ungeziefer verwandelt."),
    Book("Max Havelaar", "Multatuli", "Clásicos", "nl", "Ik ben makelaar in koffie, en woon op de Lauriergracht, No. 37."),
    Book("Candide", "Voltaire", "Clásicos", "fr", "Il y avait en Westphalie, dans le château de monsieur le baron de Thunder-ten-tronckh, un jeune garçon à qui la nature avait donné les mœurs les plus douces."),
    Book("三字经", "Tradicional", "Educación", "zh", "人之初，性本善。性相近，习相远。")
)
// Los ejemplos NO constituyen un catálogo jurídico de dominio público: verificar por territorio y edición.

data class Phrase(val category: String, val language: String, val source: String, val spanish: String, val explanation: String)
val phrases = listOf(
    Phrase("Saludos", "en", "What's up?", "¿Qué tal?", "Saludo informal. No suele responderse literalmente."),
    Phrase("Compras", "en", "I'm just looking, thanks.", "Solo estoy mirando, gracias.", "Expresión cortés para una tienda."),
    Phrase("Conversación", "en", "Could you give me a hand?", "¿Me echas una mano?", "Petición cortés mediante could."),
    Phrase("Saludos", "es", "¿Qué tal?", "How's it going?", "Saludo informal cotidiano."),
    Phrase("Saludos", "de", "Wie geht's?", "¿Cómo estás?", "Forma coloquial de Wie geht es dir?"),
    Phrase("Saludos", "nl", "Hoe gaat het?", "¿Cómo estás?", "Pregunta frecuente para saludar."),
    Phrase("Saludos", "fr", "Ça va ?", "¿Qué tal?", "Saludo coloquial y frecuente."),
    Phrase("Saludos", "zh", "你好吗？", "¿Cómo estás?", "Pregunta sencilla; 你 nǐ, 好 hǎo, 吗 ma.")
)

data class GrammarLesson(val language: String, val title: String, val rule: String, val example: String, val question: String, val options: List<String>, val correct: Int, val feedback: String)
val lessons = listOf(
    GrammarLesson("en", "Presente simple", "Para hábitos, rutinas y hechos. Con he/she/it, el verbo normalmente añade -s.", "She works every day.", "She ___ English every day.", listOf("study", "studies", "studying"), 1, "She es tercera persona singular; study cambia a studies."),
    GrammarLesson("en", "Pasado simple", "Para acciones completadas en el pasado. Los verbos regulares suelen añadir -ed.", "They visited London yesterday.", "They ___ London yesterday.", listOf("visit", "visited", "visiting"), 1, "Yesterday indica pasado: visited."),
    GrammarLesson("es", "Ser y estar", "Ser suele expresar identidad o características; estar, estados y ubicación.", "Estoy cansado.", "Yo ___ en casa.", listOf("soy", "estoy", "ser"), 1, "La ubicación se expresa con estar: estoy en casa."),
    GrammarLesson("de", "Artículos definidos", "Los artículos der, die y das varían según género y caso.", "Das Buch ist neu.", "___ Buch ist neu.", listOf("Der", "Die", "Das"), 2, "Buch es neutro; nominativo singular: das."),
    GrammarLesson("nl", "Orden verbal", "En oraciones principales afirmativas, el verbo conjugado ocupa normalmente la segunda posición.", "Vandaag lees ik een boek.", "Vandaag ___ ik een boek.", listOf("lees", "leest", "lezen"), 0, "Con ik, el presente de lezen es lees."),
    GrammarLesson("fr", "Artículos", "Le y la son artículos definidos masculinos y femeninos en singular.", "La maison est grande.", "___ maison est grande.", listOf("Le", "La", "Les"), 1, "Maison es femenino singular; usamos la."),
    GrammarLesson("zh", "Partícula 吗", "吗 (ma) al final convierte una afirmación en una pregunta de sí/no.", "你好吗？", "你___？ (¿Estás bien?)", listOf("好", "是", "有"), 0, "你好吗？ significa ¿Cómo estás?; 好 (hǎo) expresa bien.")
)
