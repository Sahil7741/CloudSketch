package com.cloudsketch.whiteboard.service;

import com.cloudsketch.whiteboard.model.DrawingData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class DrawingService {

    private static final Logger logger = LoggerFactory.getLogger(DrawingService.class);
    
    private final ConcurrentLinkedQueue<DrawingData> drawingOperations = new ConcurrentLinkedQueue<>();
    
    private static final int MAX_OPERATIONS = 10000;

    public void addDrawingOperation(DrawingData drawingData) {
        if (drawingData == null) {
            logger.warn("Attempted to add null drawing operation");
            return;
        }
        
        drawingOperations.offer(drawingData);
        
        while (drawingOperations.size() > MAX_OPERATIONS) {
            drawingOperations.poll();
        }
        
        logger.debug("Added drawing operation: {}", drawingData);
    }

    public List<DrawingData> getAllDrawingOperations() {
        return new ArrayList<>(drawingOperations);
    }

    public void clearBoard() {
        drawingOperations.clear();
        logger.info("Board cleared - all drawing operations removed");
    }

    public int getOperationCount() {
        return drawingOperations.size();
    }
}
