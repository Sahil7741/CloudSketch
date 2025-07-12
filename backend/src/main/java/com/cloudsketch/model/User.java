package com.cloudsketch.model;

public class User {
    private String id;
    private String username;
    private String email;
    private String currentRoom;
    private long lastActive;

    public User() {}

    public User(String id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.lastActive = System.currentTimeMillis();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCurrentRoom() { return currentRoom; }
    public void setCurrentRoom(String currentRoom) { this.currentRoom = currentRoom; }

    public long getLastActive() { return lastActive; }
    public void setLastActive(long lastActive) { this.lastActive = lastActive; }
}
