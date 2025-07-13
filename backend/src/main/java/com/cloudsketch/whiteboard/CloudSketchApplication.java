package com.cloudsketch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for CloudSketch Whiteboard Backend
 * This class bootstraps the Spring Boot application with authentication and WebSocket support
 */
@SpringBootApplication
public class CloudSketchApplication {

    public static void main(String[] args) {
        SpringApplication.run(CloudSketchApplication.class, args);
    }
}
