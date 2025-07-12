package com.cloudsketch.model;

public class DrawingPoint {
    private double x;
    private double y;
    private String color;
    private int strokeWidth;
    private String tool;
    private String roomId;
    private String userId;
    private long timestamp;

    public DrawingPoint() {}

    public DrawingPoint(double x, double y, String color, int strokeWidth, String tool, String roomId, String userId) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.strokeWidth = strokeWidth;
        this.tool = tool;
        this.roomId = roomId;
        this.userId = userId;
        this.timestamp = System.currentTimeMillis();
    }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public int getStrokeWidth() { return strokeWidth; }
    public void setStrokeWidth(int strokeWidth) { this.strokeWidth = strokeWidth; }

    public String getTool() { return tool; }
    public void setTool(String tool) { this.tool = tool; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
