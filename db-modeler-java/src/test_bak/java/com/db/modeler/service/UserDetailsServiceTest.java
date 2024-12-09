package com.db.modeler.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class UserDetailsServiceTest {

    @Autowired
    private UserDetailsService userDetailsService;

    @Test
    void loadUserByUsername_WithValidAdmin_ShouldReturnUserDetails() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("admin");
        
        assertNotNull(userDetails);
        assertEquals("admin", userDetails.getUsername());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        assertTrue(userDetails.isEnabled());
    }

    @Test
    void loadUserByUsername_WithValidUser_ShouldReturnUserDetails() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("user");
        
        assertNotNull(userDetails);
        assertEquals("user", userDetails.getUsername());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
        assertTrue(userDetails.isEnabled());
    }

    @Test
    void loadUserByUsername_WithInvalidUsername_ShouldThrowException() {
        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername("nonexistent");
        });
    }

    @Test
    void loadUserByUsername_AdminUser_ShouldHaveCorrectAuthorities() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("admin");
        
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }

    @Test
    void loadUserByUsername_RegularUser_ShouldHaveUserAuthorityOnly() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("user");
        
        assertFalse(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }
}
