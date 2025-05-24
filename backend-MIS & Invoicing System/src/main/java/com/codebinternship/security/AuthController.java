package com.codebinternship.security;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codebinternship.exceptions.EmailNotVerifiedException;
import com.codebinternship.exceptions.InvalidCredentialsException;
import com.codebinternship.security.dto.ForgotPasswordDTO;
import com.codebinternship.security.dto.ResetPasswordDTO;
import com.codebinternship.security.dto.User;
import com.codebinternship.security.dto.UserLoginDTO;
import com.codebinternship.security.dto.UserRegistrationDTO;
import com.codebinternship.security.dto.UserRepository;
import com.codebinternship.security.dto.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    
    private final UserService userService;
    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationDTO registrationDTO) {
        userService.registerUser(registrationDTO);
        return ResponseEntity.ok("User registered successfully. Please check your email for verification.");
    }

   
    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam String token) {
        try {
            boolean isVerified = userService.verifyUser(token);
            if (isVerified) {
                return ResponseEntity.ok("Email verified successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired token, or user already verified");
            }
        } catch (Exception e) {

            return ResponseEntity.badRequest().body("An error occurred while verifying the token");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody UserLoginDTO loginDTO) {
        try {
            String token = userService.loginUser(loginDTO);
            return ResponseEntity.ok(token);
        } catch (InvalidCredentialsException e) {

            throw e; 
        } catch (EmailNotVerifiedException e) {

            throw e; 
        } catch (Exception e) {

            throw new RuntimeException("An error occurred during login", e);
        }
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        userService.forgotPassword(forgotPasswordDTO);
        return ResponseEntity.ok("Password reset email sent. Please check your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO,
                                                @RequestHeader(value = "Authorization", required = false) String authToken) {
        boolean isLoggedIn = authToken != null && authToken.startsWith("Bearer ");

        if (isLoggedIn) {
            authToken = authToken.substring(7); 
        }

        userService.resetPassword(resetPasswordDTO, isLoggedIn, authToken);
        return ResponseEntity.ok("Password reset successful.");
    }

    
    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        try {

            String jwtToken = token.replace("Bearer ", "");

            jwtUtil.invalidateToken(jwtToken);
//            logger.info("Token invalidated successfully: {}", jwtToken);
            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {

            return ResponseEntity.badRequest().body("Logout failed");
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(jwtToken);  
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(Map.of("email", user.getEmail()));
    }
}