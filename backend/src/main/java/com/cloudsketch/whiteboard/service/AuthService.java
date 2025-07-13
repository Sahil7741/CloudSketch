package com.cloudsketch.whiteboard.service;

import com.cloudsketch.whiteboard.dto.JwtResponse;
import com.cloudsketch.whiteboard.dto.LoginRequest;
import com.cloudsketch.whiteboard.dto.SignupRequest;
import com.cloudsketch.whiteboard.dto.UserResponse;
import com.cloudsketch.whiteboard.model.User;
import com.cloudsketch.whiteboard.repository.UserRepository;
import com.cloudsketch.whiteboard.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public ResponseEntity<?> registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body("Error: Username is already taken!");
        }

        User user = new User(signUpRequest.getUsername(),
                            encoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);

        String jwt = jwtUtils.generateJwtToken(user.getUsername());
        
        return ResponseEntity.ok(new JwtResponse(jwt, user.getUsername()));
    }

    public ResponseEntity<?> authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), 
                                                      loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String jwt = jwtUtils.generateJwtToken(loginRequest.getUsername());

        return ResponseEntity.ok(new JwtResponse(jwt, loginRequest.getUsername()));
    }

    public ResponseEntity<?> getCurrentUser(String username) {
        return ResponseEntity.ok(new UserResponse(username));
    }
}
