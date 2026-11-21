package com.example.lingualibros

import org.junit.Assert.assertEquals
import org.junit.Test

class ReaderNavigationTest {
    @Test fun tokenizesWhitespaceWithoutLosingPunctuation() {
        assertEquals(listOf("Alice", "was", "tired."), ReaderNavigation.tokenize(" Alice  was\n tired. "))
    }

    @Test fun movesInsideBounds() {
        assertEquals(0, ReaderNavigation.previous(0, 3))
        assertEquals(1, ReaderNavigation.previous(2, 3))
        assertEquals(2, ReaderNavigation.next(2, 3))
        assertEquals(1, ReaderNavigation.next(0, 3))
    }

    @Test fun handlesEmptyText() {
        assertEquals(emptyList<String>(), ReaderNavigation.tokenize("   "))
        assertEquals(0, ReaderNavigation.next(0, 0))
        assertEquals(0, ReaderNavigation.previous(0, 0))
    }

    @Test fun seeksInTimeBounds() {
        assertEquals(0L, ReaderNavigation.seekBack(15_000L))
        assertEquals(35_000L, ReaderNavigation.seekBack(65_000L))
        assertEquals(70_000L, ReaderNavigation.seekForward(50_000L, 70_000L))
        assertEquals(50_000L, ReaderNavigation.seekForward(20_000L, 70_000L))
    }
}
