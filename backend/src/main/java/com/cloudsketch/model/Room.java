package com.cloudsketch.model;

import java.util.ArrayList;
import java.util.List;

public class Room {
    private String id;
    private String name;
    private List<String> activeUsers;
    private String createdBy;
    private long createdAt;

    public Room() {
        this.activeUsers = new ArrayList<>();
    }

    public Room(String id, String name, String createdBy) {
        this.id = id;
        this.name = name;
        this.createdBy = createdBy;
        this.createdAt = System.currentTimeMillis();
        this.activeUsers = new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<String> getActiveUsers() { return activeUsers; }
    public void setActiveUsers(List<String> activeUsers) { this.activeUsers = activeUsers; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }

    public void addUser(String userId) {
        if (!activeUsers.contains(userId)) {
            activeUsers.add(userId);
        }
    }

    public void removeUser(String userId) {
        activeUsers.remove(userId);
    }
}
