package com.db.modeler.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class PasswordEncoderTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void encode_ShouldGenerateEncodedPassword() {
        String rawPassword = "testPassword123";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        assertNotNull(encodedPassword);
        assertNotEquals(rawPassword, encodedPassword);
        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword));
    }

    @Test
    void matches_WithCorrectPassword_ShouldReturnTrue() {
        String rawPassword = "correctPassword";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword));
    }

    @Test
    void matches_WithIncorrectPassword_ShouldReturnFalse() {
        String rawPassword = "correctPassword";
        String wrongPassword = "wrongPassword";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        assertFalse(passwordEncoder.matches(wrongPassword, encodedPassword));
    }

    @Test
    void encode_ShouldGenerateDifferentHashesForSamePassword() {
        String password = "samePassword";
        String firstHash = passwordEncoder.encode(password);
        String secondHash = passwordEncoder.encode(password);

        assertNotEquals(firstHash, secondHash);
        assertTrue(passwordEncoder.matches(password, firstHash));
        assertTrue(passwordEncoder.matches(password, secondHash));
    }

    @Test
    void matches_WithNullOrEmptyPassword_ShouldReturnFalse() {
        String validPassword = "validPassword";
        String encodedPassword = passwordEncoder.encode(validPassword);

        assertFalse(passwordEncoder.matches(null, encodedPassword));
        assertFalse(passwordEncoder.matches("", encodedPassword));
    }
}
