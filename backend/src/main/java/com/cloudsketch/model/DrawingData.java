package com.cloudsketch.model;

import java.util.List;

public class DrawingData {
    private String type;
    private List<DrawingPoint> points;
    private String roomId;
    private String userId;
    private String action;

    public DrawingData() {}

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<DrawingPoint> getPoints() { return points; }
    public void setPoints(List<DrawingPoint> points) { this.points = points; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}
