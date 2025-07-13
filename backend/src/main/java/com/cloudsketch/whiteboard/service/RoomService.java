package com.cloudsketch.service;

import com.cloudsketch.model.User;
import com.cloudsketch.model.Room;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class RoomService {
    
    private final Map<String, Room> rooms = new ConcurrentHashMap<>();
    private final Map<String, User> users = new ConcurrentHashMap<>();

    public Room createRoom(String roomId, String roomName, String createdBy) {
        Room room = new Room(roomId, roomName, createdBy);
        rooms.put(roomId, room);
        return room;
    }

    public Room getRoom(String roomId) {
        return rooms.get(roomId);
    }

    public List<Room> getAllRooms() {
        return new ArrayList<>(rooms.values());
    }

    public void addUserToRoom(String roomId, String userId) {
        Room room = rooms.get(roomId);
        if (room != null) {
            room.addUser(userId);
        }
    }

    public void removeUserFromRoom(String roomId, String userId) {
        Room room = rooms.get(roomId);
        if (room != null) {
            room.removeUser(userId);
        }
    }

    public User createUser(String userId, String username, String email) {
        User user = new User(userId, username, email);
        users.put(userId, user);
        return user;
    }

    public User getUser(String userId) {
        return users.get(userId);
    }

    public void updateUserActivity(String userId) {
        User user = users.get(userId);
        if (user != null) {
            user.setLastActive(System.currentTimeMillis());
        }
    }
}
