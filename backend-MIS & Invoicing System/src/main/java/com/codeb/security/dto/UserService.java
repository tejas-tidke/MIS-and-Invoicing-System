

package com.codeb.security.dto;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.codeb.exceptions.EmailNotVerifiedException;
import com.codeb.exceptions.InvalidCredentialsException;
import com.codeb.security.JwtUtil;
import com.codeb.security.dto.User.Status;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

//    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final JwtUtil jwtUtil;

    @Value("${frontend.url}")
    private String frontendUrl;

    public User registerUser(UserRegistrationDTO registrationDTO) {
//        logger.info("Registering new user with email: {}", registrationDTO.getEmail());

        User user = new User();
        user.setName(registrationDTO.getName());
        user.setEmail(registrationDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        user.setRole(registrationDTO.getRole());
        user.setEnabled(false); 
        user.setVerificationToken(UUID.randomUUID().toString()); 
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24)); 
        user.setStatus(Status.active); 

        userRepository.save(user);

        
        sendVerificationEmail(user.getEmail(), user.getVerificationToken());

//        logger.info("User registered successfully: {}", user.getEmail());
        return user;
    }


    
    public boolean verifyUser(String token) {
//        logger.info("Attempting to verify user with token: {}", token);

        Optional<User> userOptional = userRepository.findByVerificationToken(token);
        if (userOptional.isEmpty()) {
//            logger.error("Invalid token: {}", token);
            return false;
        }

        User user = userOptional.get();

        
        if (user.isEnabled()) {
//            logger.info("User is already verified: {}", user.getEmail());
            return true;
        }

        
        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
//            logger.error("Expired token: {}", token);
            return false;
        }

       
        user.setEnabled(true);
        
        userRepository.save(user);

//        logger.info("User successfully verified: {}", user.getEmail());
        return true;
    }


    public void sendVerificationEmail(String email, String token) {
//        logger.info("Sending verification email to: {}", email);

        String subject = "Email Verification";
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;

        String message = "Please click the link below to verify your email:\n" + verificationUrl;

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        mailSender.send(mailMessage);

//        logger.info("Verification email sent to: {}", email);
    }

    public String loginUser(UserLoginDTO loginDTO) {
//        logger.info("Attempting login for user: {}", loginDTO.getEmail());

        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> {
//                    logger.error("User not found: {}", loginDTO.getEmail());
                    return new InvalidCredentialsException("Invalid email or password");
                });

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
//            logger.error("Invalid password for user: {}", loginDTO.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!user.isEnabled()) {
//            logger.error("Email not verified for user: {}", loginDTO.getEmail());
            throw new EmailNotVerifiedException("Email not verified. Please verify your email to log in.");
        }

        String jwtToken = jwtUtil.generateToken(user);
//        logger.info("Login successful for user: {}", loginDTO.getEmail());
        return jwtToken;
    }

    public void forgotPassword(ForgotPasswordDTO forgotPasswordDTO) {
//        logger.info("Processing forgot password request for: {}", forgotPasswordDTO.getEmail());

        User user = userRepository.findByEmail(forgotPasswordDTO.getEmail())
                .orElseThrow(() -> {
//                    logger.error("User not found: {}", forgotPasswordDTO.getEmail());
                    return new RuntimeException("User not found");
                });

        String resetToken = UUID.randomUUID().toString();
        user.setVerificationToken(resetToken);
        userRepository.save(user);

      
        sendResetPasswordEmail(user.getEmail(), resetToken);

//        logger.info("Reset password email sent to: {}", user.getEmail());
    }

	

    public void resetPassword(ResetPasswordDTO resetPasswordDTO, boolean isLoggedIn, String authToken) {
//        logger.info("Resetting password...");

        User user;

        if (isLoggedIn) {
            
            String email = jwtUtil.extractUsername(authToken); 
            user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
//                    logger.error("User not found: {}", email);
                    return new RuntimeException("User not found");
                });
        } else {
            
            user = userRepository.findByVerificationToken(resetPasswordDTO.getToken())
                .orElseThrow(() -> {
//                    logger.error("Invalid verification token: {}", resetPasswordDTO.getToken());
                    return new RuntimeException("Invalid token");
                });

            if (user.isVerificationTokenExpired()) {
//                logger.error("Expired verification token: {}", resetPasswordDTO.getToken());
                throw new RuntimeException("Token has expired");
            }

            
            user.setVerificationToken(null);
            user.setVerificationTokenExpiry(null);
        }

        
//        logger.info("Updating password for user: {}", user.getEmail());
        user.setPassword(passwordEncoder.encode(resetPasswordDTO.getNewPassword()));

        userRepository.save(user);
//        logger.info("Password reset successfully for user: {}", user.getEmail());
    }






    public void sendResetPasswordEmail(String email, String token) {
//        logger.info("Sending reset password email to: {}", email);

        String subject = "Password Reset";
        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        String message = "Please click the link below to reset your password:\n" + resetUrl;

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        mailSender.send(mailMessage);

//        logger.info("Reset password email sent to: {}", email);
    }
}
