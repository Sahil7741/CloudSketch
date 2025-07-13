package com.cloudsketch.whiteboard.controller;

import com.cloudsketch.whiteboard.model.DrawingData;
import com.cloudsketch.whiteboard.service.DrawingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Controller
@RestController
public class DrawingController {

    private static final Logger logger = LoggerFactory.getLogger(DrawingController.class);
    
    @Autowired
    private DrawingService drawingService;

    @MessageMapping("/draw")
    @SendTo("/topic/board")
    public DrawingData handleDrawing(DrawingData drawingData) {
        try {
            logger.debug("Received drawing data: {}", drawingData);
            
            if (drawingData == null) {
                logger.warn("Received null drawing data");
                return null;
            }
            
            if (drawingData.getUsername() == null || drawingData.getUsername().trim().isEmpty()) {
                logger.warn("Received drawing data with null or empty username");
                return null;
            }
            
            if (drawingData.getX() < 0 || drawingData.getY() < 0 || 
                drawingData.getX() > 2000 || drawingData.getY() > 2000) {
                logger.warn("Received drawing data with invalid coordinates: x={}, y={}", 
                    drawingData.getX(), drawingData.getY());
                return null;
            }
            
            drawingService.addDrawingOperation(drawingData);
            
            return drawingData;
        } catch (Exception e) {
            logger.error("Error handling drawing data", e);
            return null;
        }
    }
    
    @GetMapping("/api/board/state")
    public ResponseEntity<List<DrawingData>> getBoardState() {
        try {
            List<DrawingData> operations = drawingService.getAllDrawingOperations();
            logger.debug("Returning {} drawing operations for board state", operations.size());
            return ResponseEntity.ok(operations);
        } catch (Exception e) {
            logger.error("Error getting board state", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/api/board/clear")
    public ResponseEntity<String> clearBoard() {
        try {
            drawingService.clearBoard();
            logger.info("Board cleared by request");
            return ResponseEntity.ok("Board cleared successfully");
        } catch (Exception e) {
            logger.error("Error clearing board", e);
            return ResponseEntity.internalServerError().body("Error clearing board");
        }
    }
}
