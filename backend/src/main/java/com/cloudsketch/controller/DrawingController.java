package com.cloudsketch.controller;

import com.cloudsketch.model.DrawingData;
import com.cloudsketch.model.DrawingPoint;
import com.cloudsketch.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class DrawingController {

    @Autowired
    private RoomService roomService;

    @MessageMapping("/draw")
    @SendTo("/topic/drawing")
    public DrawingData handleDrawing(DrawingData drawingData) {
        for (DrawingPoint point : drawingData.getPoints()) {
            point.setTimestamp(System.currentTimeMillis());
        }
        
        roomService.updateUserActivity(drawingData.getUserId());
        return drawingData;
    }

    @MessageMapping("/clear")
    @SendTo("/topic/clear")
    public String handleClear(String roomId) {
        return roomId;
    }

    @MessageMapping("/join")
    @SendTo("/topic/users")
    public String handleUserJoin(String userData) {
        return userData;
    }
}
