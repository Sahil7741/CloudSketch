package com.cloudsketch.controller;

import com.cloudsketch.model.Room;
import com.cloudsketch.model.User;
import com.cloudsketch.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping("/rooms")
    public ResponseEntity<Room> createRoom(@RequestBody Room roomRequest) {
        Room room = roomService.createRoom(
            roomRequest.getId(), 
            roomRequest.getName(), 
            roomRequest.getCreatedBy()
        );
        return ResponseEntity.ok(room);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<Room> getRoom(@PathVariable String roomId) {
        Room room = roomService.getRoom(roomId);
        if (room != null) {
            return ResponseEntity.ok(room);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User userRequest) {
        User user = roomService.createUser(
            userRequest.getId(),
            userRequest.getUsername(),
            userRequest.getEmail()
        );
        return ResponseEntity.ok(user);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("CloudSketch Backend is running");
    }
}
