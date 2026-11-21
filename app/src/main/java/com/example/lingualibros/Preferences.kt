package com.example.lingualibros

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "user_preferences")

data class LearningPreferences(
    val nativeLanguage: String = "es",
    val readingLanguage: String = "en",
    val gender: String = "female",
    val pitch: Float = 1f,
    val speed: Float = 1f,
    val accent: String = "en-GB"
)

class PreferencesRepository(private val context: Context) {
    private object Keys {
        val native = stringPreferencesKey("native_language")
        val reading = stringPreferencesKey("reading_language")
        val gender = stringPreferencesKey("gender")
        val pitch = floatPreferencesKey("pitch")
        val speed = floatPreferencesKey("speed")
        val accent = stringPreferencesKey("accent")
    }
    val preferences: Flow<LearningPreferences> = context.dataStore.data.map { p ->
        LearningPreferences(
            nativeLanguage = p[Keys.native] ?: "es",
            readingLanguage = p[Keys.reading] ?: "en",
            gender = p[Keys.gender] ?: "female",
            pitch = p[Keys.pitch] ?: 1f,
            speed = p[Keys.speed] ?: 1f,
            accent = p[Keys.accent] ?: "en-GB"
        )
    }
    suspend fun save(p: LearningPreferences) {
        context.dataStore.edit { e ->
            e[Keys.native] = p.nativeLanguage
            e[Keys.reading] = p.readingLanguage
            e[Keys.gender] = p.gender
            e[Keys.pitch] = p.pitch
            e[Keys.speed] = p.speed
            e[Keys.accent] = p.accent
        }
    }
}
