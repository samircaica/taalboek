package com.example.lingualibros

/** Navegación segura de palabras; los índices dependen del texto visible, no del audio. */
object ReaderNavigation {
    private val nonWhitespace = Regex("\\S+")

    fun tokenize(text: String): List<String> = nonWhitespace.findAll(text).map { it.value }.toList()

    fun previous(index: Int, wordCount: Int): Int =
        if (wordCount <= 0) 0 else (index - 1).coerceIn(0, wordCount - 1)

    fun next(index: Int, wordCount: Int): Int =
        if (wordCount <= 0) 0 else (index + 1).coerceIn(0, wordCount - 1)

    fun seekBack(positionMs: Long, amountMs: Long = 30_000L): Long =
        (positionMs - amountMs).coerceAtLeast(0L)

    fun seekForward(positionMs: Long, durationMs: Long, amountMs: Long = 30_000L): Long =
        (positionMs + amountMs).coerceAtMost(if (durationMs >= 0) durationMs else Long.MAX_VALUE)
}
