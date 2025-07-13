package com.cloudsketch.whiteboard.model;

public class DrawingData {
    private double x;
    private double y;
    private double prevX; 
    private double prevY; 
    private String color;
    private int thickness;
    private String username;
    private String type; 

    public DrawingData() {}

    public DrawingData(double x, double y, String color, int thickness, String username, String type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.thickness = thickness;
        this.username = username;
        this.type = type;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getPrevX() {
        return prevX;
    }

    public void setPrevX(double prevX) {
        this.prevX = prevX;
    }

    public double getPrevY() {
        return prevY;
    }

    public void setPrevY(double prevY) {
        this.prevY = prevY;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getThickness() {
        return thickness;
    }

    public void setThickness(int thickness) {
        this.thickness = thickness;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "DrawingData{" +
                "x=" + x +
                ", y=" + y +
                ", prevX=" + prevX +
                ", prevY=" + prevY +
                ", color='" + color + '\'' +
                ", thickness=" + thickness +
                ", username='" + username + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
