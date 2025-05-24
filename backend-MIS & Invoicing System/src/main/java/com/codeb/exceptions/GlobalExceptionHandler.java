package com.codeb.exceptions;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

//    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<String> handleInvalidCredentialsException(InvalidCredentialsException e) {

        return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // Ensure 401
    }

    @ExceptionHandler(EmailNotVerifiedException.class)
    public ResponseEntity<String> handleEmailNotVerifiedException(EmailNotVerifiedException e) {

        return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN); // Ensure 403
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception e) {

        return new ResponseEntity<>("An error occurred. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}